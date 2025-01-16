import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

const firestore = getFirestore();

export const exportAndSendData = async (selectedDate: string, location: string) => {  
  try {
    // Fetch data from Firestore
    const fetchData = async (selectedDate: string, location: string): Promise<any[]> => {
      const data: any[] = [];
      const collectionPath = `inventaario/${selectedDate}/${location}`;
      const querySnapshot = await getDocs(collection(firestore, collectionPath));
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    };

    const data = await fetchData(selectedDate, location);
    if (data.length === 0) {
      console.log('No data found.');
      return;
    }

    // Create Excel file
    const createExcelFile = async (data: any[], location: string, selectedDate: string) => {
      const worksheetData: any[][] = [
        ['Päivämäärä:', selectedDate, '', '', '', ''],
        ['Sijainti:', location, '', '', '', ''],
        ['', '', '', '', '', ''],
        ['Kategoria', 'Tuotenimi', 'Määrä', 'Hinta (per yksikkö)', 'Kokonaishinta', 'ALV %'],
      ];

      const formatNumber = (num: number | string) => {
        if (typeof num === "string") {
          num = parseFloat(num);
      }
  
      // Check if the value is now a valid number
      if (isNaN(num)) {
          console.error("Invalid number:", num);
          return "Invalid number";
      }
  
      // Format the number
      return num.toFixed(2).replace('.', ',');
  };

      const groupedData: Record<string, any[]> = {
        '25.5': [],
        '14': [],
      };

      data.forEach((item) => {
        const vatRate = item.Alv || '-';
        groupedData[vatRate]?.push(item);
      });

      let overallTotal : number = 0;
      Object.keys(groupedData).forEach((vatRate) => {
        worksheetData.push([`ALV ${vatRate}%`, '', '', '', '', '']);
        let vatTotal : number = 0;

        groupedData[vatRate].forEach((item) => {
          const totalPrice : number = (item.Määrä || 0) * (item.Hinta || 0);
          vatTotal += totalPrice;
          worksheetData.push([
            item.Kategoria || 'Uncategorized',
            item.Nimi || 'Unnamed Item',
            item.Määrä || 0,
            item.Hinta || 0,
            formatNumber(totalPrice),
            item.Alv,
          ]);
        });

        overallTotal += vatTotal / (1 + parseFloat(vatRate) / 100);
        worksheetData.push(['', '', '', 'Yht :', formatNumber(vatTotal), '']);
      });

      worksheetData.push(['', '', '', 'Inventaario Alv 0%:', formatNumber(overallTotal), '']);

      // VAT Totals and Alv 0% calculations
      const overallAlv25 : number = groupedData['25.5'].reduce(
        (sum, item) => sum + (item.Määrä || 0) * (item.Hinta || 0),
        0
      );
      const Alv25Alv0 : number = overallAlv25 / 1.255;
      worksheetData.push(['', '', '', 'Yhteensä Alv 25.5%:', formatNumber(overallAlv25), 'Alv 0%', formatNumber(Alv25Alv0)]);

      const overallAlv14 : number = groupedData['14'].reduce(
        (sum, item) => sum + (item.Määrä || 0) * (item.Hinta || 0),
        0
      );
      const Alv14Alv0 : number = overallAlv14 / 1.14;
      worksheetData.push(['', '', '', 'Yhteensä Alv 14%:', formatNumber(overallAlv14), 'Alv 0%', formatNumber(Alv14Alv0)]);

      // KP-1530 and KP-4400 calculations
      const previousMonthValue : number = await getPreviousMonthValue(selectedDate, location);

      const kp1530 : number = overallTotal - previousMonthValue
      const kp4400 : number = kp1530 * -1
      
      worksheetData.push(['', '', '', '', '', '', '', 'Tili','Brutto','ALV-%','ALV-väh-%','ALV-tyyppi','ALV-status','Tase-erä tunniste','Vientiselite',]);
      worksheetData.push(['', '', '','Edellisen kuukauden alv 0%:',formatNumber(previousMonthValue),'','', '1530:', formatNumber(kp1530), '0','100','P','vat_12','',`Inventaario ${location} ${selectedDate} `,]);
      worksheetData.push(['', '', '','','','','', '4400:', formatNumber(kp4400), '0','100','P','vat_12','',`Inventaario ${location} ${selectedDate} `,]);

      // Create workbook and write to file
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const fileUri = `${FileSystem.documentDirectory}inventaario-${location}-${selectedDate}.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      return { fileUri, overallTotal };
    };

    const getPreviousMonthValue = async (selectedDate: string, location: string): Promise<number> => {
      const [month, year] = selectedDate.split('-').map(Number);
    
      // Adjust year only if the month is January
      const previousYear = month === 1 ? year - 1 : year;
      const previousMonth = month === 1 ? 12 : month - 1;
   
      
      const formattedPreviousMonth = `${String(previousMonth).padStart(2, '0')}-${previousYear}`;
    
      const docRef = doc(firestore, `inventaario/${formattedPreviousMonth}`);
      const docSnap = await getDoc(docRef);
      const fieldName = location === 'sali' ? 'Sali' : 'Keittiö';

      return docSnap.exists() ? docSnap.data()?.[`${fieldName}Alv0`] || 0 : 0;
    };

    const { fileUri, overallTotal } = await createExcelFile(data, location, selectedDate);

    // Send email and save to Firestore
    const sendEmail = async (fileUri: string, location : string) => {
      const available = await MailComposer.isAvailableAsync();
      if (available) {
        const options = {
          recipients: ['olli.vainio@tekodo.fi'],
          subject: `Inventaario Kauppuri 5 - ${selectedDate} - ${location} (Älä vastaa tähän viestiin)`  ,
          body: `Liitteenä inventaario ${location} - ${selectedDate}`,
          attachments: [fileUri],
        };

        const result = await MailComposer.composeAsync(options);

        if (result.status === MailComposer.MailComposerStatus.SENT) {
          const fieldName = location === 'sali' ? 'SaliAlv0' : 'KeittiöAlv0';
          const docRef = doc(firestore, `inventaario/${selectedDate}`);
          await setDoc(docRef, { [fieldName]: overallTotal.toFixed(2) }, { merge: true });
        }
      }
    };

    await sendEmail(fileUri , location);
  } catch (error) {
    console.error('Error:', error);
  }
};
