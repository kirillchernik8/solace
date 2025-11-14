"use client";

import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    fetch("/api/pages").then((response) => {
      response.json().then((jsonResponse) => {
        setPages(Math.ceil(jsonResponse.data[0].count / recordsPerPage));
      });
    });
  }, [recordsPerPage]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates",  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, recordsPerPage }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log("fetched advocates", jsonResponse);
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, [page, recordsPerPage]);



  const onChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.map(function lowercaseSpecialties ( speciality ) { return speciality.toLowerCase()}).includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  const updateRecordsPerPage = useCallback((e) => {
    setPage(1)
    setRecordsPerPage(Number(e.target.value))
  }, [])

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.phoneNumber}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        {page !== 1 && <div onClick={()=>setPage((prev) => prev-1)}>Prev</div>}
        <div>{pages}</div>
        {page < pages && <div onClick={()=>setPage((prev) => prev+1)}>NEXT</div>}
      </div>

      <div>
        <label htmlFor="record-select">Records Per Page</label>
        <select id="record-select" name="records" onChange={(e) => updateRecordsPerPage(e)} >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </main>
  );
}
