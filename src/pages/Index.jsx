import React, { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
      },
    });
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (index, header, value) => {
    const newData = [...data];
    newData[index][header] = value;
    setData(newData);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      <div className="mb-4">
        <Button onClick={handleAddRow}>Add Row</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={header}>
                  <input
                    type="text"
                    value={row[header]}
                    onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    className="w-full"
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <CSVLink data={data} headers={headers} filename={"edited_data.csv"}>
          <Button>Download CSV</Button>
        </CSVLink>
      </div>
    </div>
  );
};

export default Index;