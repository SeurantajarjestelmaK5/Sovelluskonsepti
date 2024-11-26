import React from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import * as Permissions from 'expo-permissions';

const firestore = getFirestore();

export const exportAndSendData = async (selectedDate : any, location: string) => {
  try {
    // Step 1: Fetch data from Firestore
    const fetchData = async (selectedDate : any, location: string) => {
      const data : any = [];
      const collectionPath = `inventaario/${selectedDate}/${location}`;
      console.log(collectionPath);
      
      const querySnapshot = await getDocs(collection(firestore, collectionPath));
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log(data);
      return data;
      
    };

    const data = await fetchData(selectedDate, location);

    if (data.length === 0) {
      console.log('No data found.');
      return;
    }

    // Step 2: Create Excel file
    const createExcelFile = async (data : any, location : string, selectedDate: any) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      console.log("created worksheet");
      
      const workbook = XLSX.utils.book_new();
      console.log("created workbook");

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const fileUri = FileSystem.documentDirectory + `inventaario-${location}-${selectedDate}.xlsx`;
      
        console.log("trying to write to system");
        
       try {await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      })

      console.log('File written successfully:', fileUri);
      ;} catch (e) {
        console.log(e);
     
      }

      return fileUri;
    };

    const fileUri = await createExcelFile(data, selectedDate, location);

    // Step 3: Send Email with Attachment
    const sendEmail = async (fileUri : string) => {
        console.log("started email sending");
        const fileExists = await FileSystem.getInfoAsync(fileUri);
        console.log('File exists:', fileExists.exists);
       const  available : boolean = await MailComposer.isAvailableAsync()
      console.log(available);
      if (available) {
      const options = {
        recipients: ['ruotsalainen.samuli@gmail.com'], // Change to your email address
        subject: `Inventory Data - ${selectedDate} - ${location}`,
        body: 'Attached is the Excel file with the inventory data.',
        attachments: [fileUri],
      };

      const result = await MailComposer.composeAsync(options);

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        console.log('Email sent successfully!');
      } else {
        console.log('Failed to send email:', result.status);
      }}  
    };

    await sendEmail(fileUri);

  } catch (error) {
    console.error('Error:', error);
  }
};
