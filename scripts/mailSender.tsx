import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

const firestore = getFirestore();

export const exportAndSendData = async (selectedDate : any, location : string) => {
  try {
    // Step 1: Fetch Data from Firestore
    const fetchData = async (selectedDate : any, location : string) => {
      const data : any = [];
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

    // Step 2: Create Excel File
    const createExcelFile = async (data : any, location : string, selectedDate : any) => {
      // Initialize worksheet data with headers
      const worksheetData = [
        ['Päivämäärä:', selectedDate, '', '', '', ''],
        ['Sijainti:', location, '', '', '', ''],
        ['', '', '', '', '', ''],
        ['Kategoria', 'Tuotenimi', 'Määrä', 'Hinta (per yksikkö)', 'Kokonaishinta', 'ALV %'],
      ];

      // Group data by VAT rate
      const groupedData : any = {
        '25.5': [],
        '14': [],
      };

      data.forEach((item : any) => {
        const vatRate = item.Alv || '-';
        groupedData[vatRate]?.push(item);
      });

      // Add items grouped by VAT rate
      Object.keys(groupedData).forEach((vatRate) => {
        worksheetData.push([`ALV ${vatRate}%`, '', '', '', '', '']); // Section header
        let vatTotal = 0;

        groupedData[vatRate].forEach((item : any) => {
          const totalPrice = (item.Määrä || 0) * (item.Hinta || 0);
          vatTotal += totalPrice;
          worksheetData.push([
            item.Kategoria || 'Uncategorized',
            item.Nimi || 'Unnamed Item',
            item.Määrä || 0,
            item.Hinta || 0,
            totalPrice.toFixed(2),
            item.Alv,
          ]);
        });

        // Add subtotal for the VAT group
        worksheetData.push(['', '', '', 'Yht :', vatTotal.toFixed(2), '']);
      });

      // Calculate overall total
      const overallTotal : any = Object.values(groupedData).flat().reduce((sum : any, item: any) => {
        const vatRate = parseFloat(item.Alv || 0); 
        const itemTotal = (item.Määrä || 0) * (item.Hinta || 0); 
        const vatRemovedTotal = vatRate > 0 ? itemTotal / (1 + vatRate / 100) : itemTotal; 
        return sum + vatRemovedTotal;
      }, 0);
      
      worksheetData.push(['', '', '', 'Inventaario Alv 0%:', overallTotal.toFixed(2), '']);

      const overallAlv25 : any = Object.values(groupedData["25.5"]).flat().reduce((sum : any, item : any) => {
        return sum + (item.Määrä || 0) * (item.Hinta || 0);
      }, 0);
      const Alv25Alv0 : any = overallAlv25 / (1 + 25.5 / 100)
      worksheetData.push(['', '', '', 'Yhteensä Alv 25.5%:', overallAlv25.toFixed(2), 'Alv 0%', Alv25Alv0.toFixed(2)]);
      
      const overallAlv14 : any = Object.values(groupedData["14"]).flat().reduce((sum : any, item : any) => {
        return sum + (item.Määrä || 0) * (item.Hinta || 0);
      }, 0);
      const Alv14Alv0 : any = overallAlv14 / (1 + 14 / 100)
      worksheetData.push(['', '', '', 'Yhteensä Alv 14%:', overallAlv14.toFixed(2), 'Alv 0%', Alv14Alv0.toFixed(2)]);

      // Create worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Write the workbook to file
      const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const fileUri = FileSystem.documentDirectory + `inventaario-${location}-${selectedDate}.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return fileUri;
    };

    const fileUri = await createExcelFile(data, location, selectedDate);

    // Step 3: Send Email with Attachment
    const sendEmail = async (fileUri : string) => {
      const available = await MailComposer.isAvailableAsync();
      if (available) {
        const options = {
          recipients: ['ruotsalainen.samuli@gmail.com'], // Change to your email address
          subject: `Inventaario Kauppuri 5 - ${selectedDate} - ${location}`,
          body: `Liitteenä inventaario ${selectedDate}`,
          attachments: [fileUri],
        };

        const result = await MailComposer.composeAsync(options);

        if (result.status === MailComposer.MailComposerStatus.SENT) {
          console.log('Email sent successfully!');
        } else {
          console.log('Failed to send email:', result.status);
        }
      }
    };

    await sendEmail(fileUri);

  } catch (error) {
    console.error('Error:', error);
  }
};
