import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';

const Dashboard = ({settoken}) => {
    const [newemploye, setnewemploye] = useState({
        id: null,  
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        salary: '',
        date: '',
      });
      

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [idEdited, setidEdited] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const[totalPages,setTotalpages]= useState(0)
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');


  const handleNewEmployee = (e) => {
    const { name, value } = e.target;
    setnewemploye((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchAllEmployees = async () => {
    try {
      const res = await fetch(`https://employessjson.onrender.com/employees?_page=${currentPage}&_limit=5`);
      if (res.ok) {
        const data = await res.json();
        const totalItems = res.headers.get('X-Total-Count');
        const totalPage = Math.ceil(totalItems / pageSize);
        setTotalpages(totalPage)

        
        setEmployees(data);
      } else {
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  
 
  const fetchEmployees = async(val) => {
    setDepartmentFilter(val);
     
    try {
      const res = await fetch(`https://employessjson.onrender.com/employees?_page=${currentPage}&_limit=5&department=${val}`);
      if (res.ok) {
        const data = await res.json();
        const totalItems = res.headers.get('X-Total-Count');
        const totalPage = Math.ceil(totalItems / pageSize);
        setTotalpages(totalPage)
        console.log(`Total Pages: ${totalPages}`);
        setEmployees(data);
      } else {
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error fetching employees', error);
    }

    
  };
  
  
  
  useEffect(() => {
    fetchAllEmployees();
  }, [currentPage]); 


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const maxId = employees.reduce((max, employee) => Math.max(max, employee.id), 0);

    if (idEdited !== null) {
       
      try {
        const res = await fetch(`https://employessjson.onrender.com/employees/${idEdited}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newemploye),
        });

        if (res.ok) {
          const updatedEmployees = employees.map((employee) =>
            employee.id === idEdited ? newemploye : employee
          );
          setEmployees(updatedEmployees);
          setidEdited(null);
          setShowForm(false);
          setnewemploye({
            id: null,
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            salary: '',
            date: '',
          });
        } else {
          console.error('Error updating employee');
        }
      } catch (error) {
        console.error('Error updating employee', error);
      }
    } else {
       
      const newEmployeeId = maxId + 1;
      try {
        const res = await fetch('https://employessjson.onrender.com/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newemploye, id: newEmployeeId }),
        });

        if (res.ok) {
          const data = await res.json();
         fetchAllEmployees();
          setShowForm(false);
          setnewemploye({
            id: null,
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            salary: '',
            date: '',
          });
        } else {
          console.error('Error adding employee');
        }
      } catch (error) {
        console.error('Error adding employee', error);
      }
    }
  };

  const handleEditClick = (employee) => {
    setShowForm(true);
    setidEdited(employee.id);
    setnewemploye(employee);
  };


  //Deleteting =---------------------
  const handleDelete = async (employeeId) => {
    try {
      const res = await fetch(`https://employessjson.onrender.com/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
        fetchAllEmployees();
      } else {
        console.error('Error deleting employee');
      }
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };


//sorting -----------------------
  const handleSortChange = async(event) => {
    setSelectedSort(event.target.value);

    try {
      const res = await fetch(`https://employessjson.onrender.com/employees?_page=${currentPage}&_limit=5&_sort=salary&_order=${event.target.value}`);
      if (res.ok) {
        const data = await res.json();
        const totalItems = res.headers.get('X-Total-Count');
        const totalPage = Math.ceil(totalItems / pageSize);
        setTotalpages(totalPage)
        console.log(`Total Pages: ${totalPages}`);
        setEmployees(data);
      } else {
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error fetching employees', error);
    }
    
  };

  const sortOptions = [
    { value: 'asc', label: 'Low-to-High' },
    { value: 'desc', label: 'High-to-Low' },
  ];
   
  return (
    <ChakraProvider>
      <Box p={8} width="800px" >
        <Heading mb={6} textAlign="center" color="teal.500">
          Employee Management Software
        </Heading>

        <Box display="flex" gap="1rem" mb={4} marginTop="2rem">
          <Button
            colorScheme="teal"
            variant="solid"
            size="md"
            onClick={() => setShowForm(true)}
          >
            Add Employee
          </Button>
          <Button colorScheme="red" variant="solid" size="md" onClick={()=> {
      localStorage.removeItem("token")
          settoken(false)} 
          }
         >
            Log Out
          </Button>
        </Box>
        

        {showForm && (
          <form onSubmit={handleFormSubmit}>
          
        <FormControl mb={4}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={newemploye.firstName}
            onChange={handleNewEmployee}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={newemploye.lastName}
            onChange={handleNewEmployee}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={newemploye.email}
            onChange={handleNewEmployee}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Department</FormLabel>
          <Select
            name="department"
            value={newemploye.department}
            onChange={handleNewEmployee}
            required
          >
            <option value="">Select Department</option>
            <option value="tech">Tech</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Salary</FormLabel>
          <Input
            type="number"
            name="salary"
            value={newemploye.salary}
            onChange={handleNewEmployee}
            required
          />
        </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={newemploye.date}
                onChange={handleNewEmployee}
                required
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" variant="solid" size="md">
              Submit
            </Button>
          </form>
        )}
        <Box display="flex"  gap="1rem" alignItems="center">
        <FormControl mb={4}>
  <FormLabel>Filter by Department</FormLabel>
  <Select
    name="departmentFilter"
    value={departmentFilter}
    onChange={(e) => fetchEmployees(e.target.value)}
  >
    <option value="">All Departments</option>
    <option value="tech">Tech</option>
    <option value="marketing">Marketing</option>
    <option value="operations">Operations</option>
  </Select>
</FormControl>
  <Box mt={4} display="flex" justifyContent="center">
      <Select
        placeholder="Sort by Salary"
        value={selectedSort}
        onChange={handleSortChange}
        width="200px"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Box>
    </Box>
        <Table variant="simple" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Salary</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee, index) => (
              <Tr key={index}>
                <Td>{index+1}</Td>
                <Td>{employee.firstName}</Td>
                <Td>{employee.lastName}</Td>
                <Td>{employee.email}</Td>
                <Td>{employee.department}</Td>
                <Td>${employee.salary}</Td>
                <Td>{employee.date}</Td>
                <Td>
                  <Button size="sm" colorScheme="teal" variant="outline"  onClick={()=>handleEditClick(employee)}>
                    Edit
                  </Button>
                </Td>
                <Td>
                  <Button size="sm" colorScheme="red" variant="outline"  onClick={() => handleDelete(employee.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            mx={2}
            colorScheme="teal"
            disabled={currentPage == 1}
            onClick={() => setCurrentPage((prevPage) => currentPage!==1?prevPage - 1:1)}
          >
            Previous
          </Button>
          <Box display="flex" justifyContent="center">
          {[...Array(totalPages).keys()].map((page) => (
            <Button
              key={page}
              mx={2}
              colorScheme="teal"
              variant={currentPage === page + 1 ? 'solid' : 'outline'}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </Button>
          ))}
        </Box>

          <Button
            mx={2}
            colorScheme="teal"
            disabled={currentPage === (totalPages)}
            onClick={() => setCurrentPage((prevPage) => currentPage!==totalPages?prevPage + 1:currentPage)}
          >
            Next
          </Button>
        </Box>

      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;
