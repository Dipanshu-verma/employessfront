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
    const [employeeData, setEmployeeData] = useState({
        id: null, // Add id to the state
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        salary: '',
        date: '',
      });
      

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [departmentFilter, setDepartmentFilter] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchAllEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3001/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  
  const filterEmployeesByDepartment = (val) => {
    
    
    return employees.filter((employee) => employee.department === val);
  };
  
  const fetchEmployees = (val) => {
    setDepartmentFilter(val);
    const filteredEmployees = filterEmployeesByDepartment(val);
    setEmployees(filteredEmployees);
  };
  
  
  
  useEffect(() => {
    fetchAllEmployees();
  }, []); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const maxId = employees.reduce((max, employee) => Math.max(max, employee.id), 0);

    if (editId !== null) {
       
      try {
        const res = await fetch(`http://localhost:3001/employees/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });

        if (res.ok) {
          const updatedEmployees = employees.map((employee) =>
            employee.id === editId ? employeeData : employee
          );
          setEmployees(updatedEmployees);
          setEditId(null);
          setShowForm(false);
          setEmployeeData({
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
        const res = await fetch('http://localhost:3001/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...employeeData, id: newEmployeeId }),
        });

        if (res.ok) {
          const data = await res.json();
          setEmployees([...employees, data]);
          setShowForm(false);
          setEmployeeData({
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
    setEditId(employee.id);
    setEmployeeData(employee);
  };

  const handleDeleteClick = async (employeeId) => {
    try {
      const res = await fetch(`http://localhost:3001/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
        setEmployees(updatedEmployees);
      } else {
        console.error('Error deleting employee');
      }
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };

  const totalPages = Math.ceil(employees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleEmployees = employees.slice(startIndex, endIndex);
console.log(visibleEmployees);

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
        <FormControl mb={4}>
  <FormLabel>Filter by Department</FormLabel>
  <Select
    name="departmentFilter"
    value={departmentFilter}
    onChange={(e) => fetchEmployees(e.target.value)}
  >
    <option value="">All Departments</option>
    <option value="Tech">Tech</option>
    <option value="Marketing">Marketing</option>
    <option value="Operations">Operations</option>
  </Select>
</FormControl>

        {showForm && (
          <form onSubmit={handleFormSubmit}>
          
        <FormControl mb={4}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={employeeData.firstName}
            onChange={handleInputChange}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={employeeData.lastName}
            onChange={handleInputChange}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleInputChange}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Department</FormLabel>
          <Select
            name="department"
            value={employeeData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Tech">Tech</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Salary</FormLabel>
          <Input
            type="number"
            name="salary"
            value={employeeData.salary}
            onChange={handleInputChange}
            required
          />
        </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={employeeData.date}
                onChange={handleInputChange}
                required
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" variant="solid" size="md">
              Submit
            </Button>
          </form>
        )}

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
            {visibleEmployees.map((employee, index) => (
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
                  <Button size="sm" colorScheme="red" variant="outline"  onClick={() => handleDeleteClick(employee.id)}>
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
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next
          </Button>
        </Box>

      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;
