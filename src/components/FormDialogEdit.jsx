import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SvgIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { format } from 'date-fns';

function FormDialogEdit({open, handleClose, handleClickOpen, onSubmitSuccess, customer}) {
    const [customerInfo, setCustomerInfo] = useState({
        name: customer.name,
        lastname: customer.lastname,
        birthdate: null,
        cuit: customer.cuit,
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      });

    async function editCustomer (formJson) {
        try {
          console.log(formJson)
          const response = await fetch('http://localhost:8080/edit/' + customer.id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formJson),
          });
      
          if (response.ok) {
            console.log('Customer edit succesfully');
            onSubmitSuccess();
            handleClose();
          } else {
            console.error('Customer edit error');
          }
        } catch (error) {
          console.error(error);
        }
    }

  return (
    <div>
        <Button
            startIcon={(
                <SvgIcon fontSize="small">
                    <EditIcon />
                </SvgIcon>
            )}
            variant="text"
            onClick={handleClickOpen}></Button>
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson.birthdate)
            if(formJson.birthdate!==""){
              formJson.birthdate = format(new Date(formJson.birthdate), "dd/MM/yyyy")
            }
            editCustomer(formJson)
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter customer details
          </DialogContentText>
          <TextField autoFocus required id="name" name="name" label="Name" type="text" fullWidth variant="standard"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
          />
          <TextField
            required id="lastname" name="lastname" label="Lastname" type="text" fullWidth variant="standard"
            value={customerInfo.lastname}
            onChange={(e) => setCustomerInfo({ ...customerInfo, lastname: e.target.value })}
          />
          <TextField sx={{marginTop:"25px"}} type="date" id='birthdate' name='birthdate' fullWidth
          value={customer.birthdate}
          defaultValue={customer.birthdate}
            onChange={(e) => {
                const date = new Date(e.target.value);
                setCustomerInfo({ ...customerInfo, birthdate: date });
            }}
          />
          <TextField
            required id="cuit" name="cuit" label="CUIT" type="text" fullWidth variant="standard"
            value={customerInfo.cuit}
            onChange={(e) => setCustomerInfo({ ...customerInfo, cuit: e.target.value })}
          />
          <TextField
            id="address" name="address" label="Address" type="text" fullWidth variant="standard"
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
          />
          <TextField
            required id="phoneNumber" name="phoneNumber" label="Phone Number" type="text" fullWidth variant="standard"
            value={customerInfo.phoneNumber}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
          />
          <TextField
            required id="email" name="email" label="Email" type="email" fullWidth variant="standard"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Accept</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default FormDialogEdit