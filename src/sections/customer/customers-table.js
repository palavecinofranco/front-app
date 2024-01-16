import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInitials } from 'src/utils/get-initials';
import FormDialogEdit from 'src/components/FormDialogEdit';
import { useState } from 'react';

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onSubmitSuccess
  } = props;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function deleteCustomer() {
    if (customersSelected.length > 0) {
      try {
        const deletePromises = customersSelected.map(async (customer) => {
          const response = await fetch(`http://localhost:8080/delete/${customer.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            console.log(`Customer ${customer.id} deleted successfully`);
          } else {
            console.error(`Error deleting customer ${customer.id}`);
          }
        });
  
        await Promise.all(deletePromises);
        onSubmitSuccess();
      } catch (error) {
        console.error('Error deleting customers:', error);
      }
    }
  }

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const [customersSelected, setCustomersSelected] = useState([]);

  return (
    <>
      <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                        setCustomersSelected(items)
                      } else {
                        onDeselectAll?.();
                        setCustomersSelected([])
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Birthdate</TableCell>
                <TableCell>CUIT</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{textAlign:"center"}}>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center" }}>
                    <Typography variant='subtitle1'>The customer table is empty!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((customer) => {
                  const isSelected = selected.includes(customer.id);
                  return (
                    <TableRow hover key={customer.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(customer.id);
                              const customersUpdate = [...customersSelected, customer]
                              setCustomersSelected(customersUpdate)
                              console.log(customersSelected)
                            } else {
                              onDeselectOne?.(customer.id);
                              const customersUpdate = customersSelected.filter((selectedCustomer) => selectedCustomer.id !== customer.id);
                              setCustomersSelected(customersUpdate)
                              console.log(customersSelected)
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar>{getInitials(customer.name)}</Avatar>
                          <Typography variant="subtitle2">{customer.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer.lastname}</TableCell>
                      <TableCell>{customer.birthdate}</TableCell>
                      <TableCell>{customer.cuit}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <FormDialogEdit open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} customer={customer} onSubmitSuccess={onSubmitSuccess}></FormDialogEdit>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
        <Button sx={{margin:"15px"}}
                          startIcon={
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
                            </SvgIcon>
                          }
                          variant="contained"
                          onClick={deleteCustomer}
                        >Delete</Button>
      </Card>
    </>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
