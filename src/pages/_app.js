import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import FormDialogAdd from 'src/components/FormDialogAdd';

const Page = () => {
  
  
const [listCustomers, setListCustomers] = useState([]);
const [open, setOpen] = useState(false);

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8080/list');
    const result = await response.json();
    setListCustomers(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
    fetchData();
  }, []);

const updateListCustomers = useCallback(() => {
  fetchData(); 
}, []);

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(listCustomers, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (listCustomers) => {
  return useMemo(
    () => {
      return listCustomers.map((customer) => customer.id);
    },
    [listCustomers]
  );
};

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customersIds = useCustomerIds(listCustomers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Customers
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Customers
                </Typography>
              </Stack>
              <div>
                <FormDialogAdd onSubmitSuccess={updateListCustomers} open={open} handleClose={handleClose} handleClickOpen={handleClickOpen}/>
              </div>
            </Stack>
            <CustomersSearch />
            <CustomersTable
              count={listCustomers.length}
              items={listCustomers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              onSubmitSuccess={updateListCustomers} 
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
