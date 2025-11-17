"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHttp } from "./api/utils/fetcher";
import { Advocate } from "@/types/advocateType";
import localFont from "next/font/local";
import Image from "next/image";
import UndoIcon from '../../public/undo.svg';

export const mollieGlaston = localFont({
  src: [ {  path: '../../public/fonts/Mollie\ Glaston.woff2', }, ],
})

export default function Home() {
  const [advocates, setAdvocates] = useState<Array<Advocate>>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Array<Advocate>>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(5);
  const [pages, setPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalRecords = useRef<number>(0)

  useEffect(() => {
    const fetchPages = async () => {
      try{
        const response = await fetchHttp<{ count: number }>('/api/pages', 'GET');
        setPages(Math.ceil(response.count / recordsPerPage));
        totalRecords.current = response.count
      } catch (error) {
        // TODO: better error handling
        console.error("Error fetching pages:", error);
      }
    }

    fetchPages()
  }, [recordsPerPage]);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetchHttp<{ data: Array<Advocate> }>('/api/advocates', 'POST', { page, recordsPerPage });
        setAdvocates(response.data);
        setFilteredAdvocates(response.data);
      }
      catch (error) {
        // TODO: better error handling
        console.error("Error fetching advocates:", error);
      }
    }

    fetchAdvocates()
  }, [page, recordsPerPage]);


  const onSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setTimeout(async () => {
      setSearchTerm(term);

      // TODO: may be a bug here?
      const filteredAdvocates = await fetchHttp<{ searched: Array<Advocate>; count: number }>("/api/search", "POST", { searchTerm: term, page, recordsPerPage });

      // TODO: reset page?
      setPage(1);
      setPages(Math.ceil(filteredAdvocates.count / recordsPerPage));
      setFilteredAdvocates(filteredAdvocates.searched);
    }, 100)
  }, [page, recordsPerPage]);

  const onSearchReset = useCallback(() => {
    // TODO: reset page?
    setPage(1)
    setSearchTerm("");
    setPages(Math.ceil(totalRecords.current / recordsPerPage));
    setFilteredAdvocates(advocates);
  }, [advocates, recordsPerPage]);

  const onChangeRecordsPerPage = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    // TODO: reset page?
    setPage(1)
    setPages(Math.ceil(filteredAdvocates.length / recordsPerPage));
    setRecordsPerPage(Number(e.target.value))
  }, [filteredAdvocates, recordsPerPage])

  return (
    <main style={{ margin: "24px" }} className="bg-white">
      <h1 className={mollieGlaston.className}>Solace Advocates</h1>
      <form>
          <div>
            <div className="relative flex items-center w-full">
              <input value={searchTerm} type="text" className="bg-white border border-gray rounded-2 block w-full py-2 px-1 focus:outline-none placeholder:text-body"
                placeholder="Search"
                onChange={onSearchInputChange}
                required
              />
              <button
                type="button"
                className="cursor-pointer text-black bg-white border border-transparent rounded focus:outline-none absolute right-2 top-2"
                onClick={onSearchReset}
              >
                <Image src={UndoIcon} alt="Reset" width={16} height={16} />
              </button>
            </div>
          </div>
      </form>
      <div className="relative overflow-x-auto bg-white shadow-xs border border-gray mt-4 rounded-2">
        <table className="w-full text-sm text-center">
          <thead className="text-sm border-gray">
            <tr>
              {/* TODO: class duplicates */}
              <th className="px-1 py-3 h-6 w-6 font-medium">First Name</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">Last Name</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">City</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">Degree</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">Specialties</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">Years of Experience</th>
              <th className="px-1 py-3 h-6 w-6 font-medium">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: no results found */}
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id} className="odd:bg-gray px-8">
                  <td className="px-1 py-3 overflow-hidden whitespace-nowrap h-6 w-6">{advocate.firstName}</td>
                  <td className="px-1 py-3 overflow-hidden whitespace-nowrap truncate w-6 h-6">{advocate.lastName}</td>
                  <td className="px-1 py-3 overflow-hidden whitespace-nowrap truncate w-6 h-6">{advocate.city}</td>
                  <td className="px-1 py-3 overflow-hidden whitespace-nowrap truncate w-6 h-6">{advocate.degree}</td>
                  <td className="px-1 py-3 overflow-hidden w-8 h-6">
                    <div className="line-clamp-1" title={advocate.specialties.join(", ")}>{advocate.specialties.join(", ")}</div>
                  </td>
                  <td className="px-1 py-3 overflow-hidden w-6 h-6">{advocate.yearsOfExperience}</td>
                  <td className="px-1 py-3 overflow-hidden w-6 h-6">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 gap-2 w-full">
        {/* TODO: styling */}
        <div className="flex justify-between items-center gap-2">
          {page !== 1 && <button className="cursor-pointer" onClick={()=>setPage((prev) => prev-1)}>previous</button>}
          {[...Array(pages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`px-2 py-1 border rounded-2 ${pageNum === page ? "bg-green text-gray" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
          })}
          {page < pages && <button className="cursor-pointer" onClick={()=>setPage((prev) => prev+1)}>next</button>}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <label htmlFor="record-select">Records Per Page</label>
        <select id="record-select" name="records" onChange={onChangeRecordsPerPage} >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </main>
  );
}
