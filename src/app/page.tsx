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
        console.error("Error fetching advocates:", error);
      }
    }

    fetchAdvocates()
  }, [page, recordsPerPage]);



  const onSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredAdvocates = await fetchHttp<{ searched: Array<Advocate>; count: number }>("/api/search", "POST", { searchTerm: term });

    setPage(1);
    setPages(Math.ceil(filteredAdvocates.count / recordsPerPage));
    setFilteredAdvocates(filteredAdvocates.searched);
  };

  const onSearchReset = useCallback(() => {
    setPage(1)
    setPages(Math.ceil(totalRecords.current / recordsPerPage));
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  }, [advocates, recordsPerPage]);

  const onChangeRecordsPerPage = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1)
    setPages(Math.ceil(filteredAdvocates.length / recordsPerPage));
    setRecordsPerPage(Number(e.target.value))

  }, [filteredAdvocates, recordsPerPage])

  return (
    <main style={{ margin: "24px" }} className="bg-(--color-white) ">
      <h1 className={mollieGlaston.className}>Solace Advocates</h1>
      <br />
      <br />
      <form>
          <div>
            <div className="flex">
              <input value={searchTerm} type="text" className="bg-white border border-gray rounded-md block w-full py-8 focus:outline-none placeholder:text-body" placeholder="Search" onChange={onSearchInputChange}  required />
              <button type="button" className="text-black bg-white border border-transparent leading-5 rounded-full focus:outline-none [&_img]:invert" onClick={onSearchReset} >
                <Image src={UndoIcon} className="bg-gray" alt="Reset" width={16} height={16} />
              </button>
            </div>
          </div>
      </form>
      <br />
      <br />
      <div className="relative overflow-x-auto bg-white shadow-xs rounded-base border border-gray">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-gray">
            <tr>
              <th className="px-1 py-3 font-medium">First Name</th>
              <th className="px-1 py-3 font-medium">Last Name</th>
              <th className="px-1 py-3 font-medium">City</th>
              <th className="px-1 py-3 font-medium">Degree</th>
              <th className="px-1 py-3 font-medium">Specialties</th>
              <th className="px-1 py-3 font-medium">Years of Experience</th>
              <th className="px-1 py-3 font-medium">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id} className="odd:bg-gray px-8">
                  <th scope="row" className="px-1 py-3 font-medium text-heading whitespace-nowrap">{advocate.firstName}</th>
                  <td className="px-1 py-3">{advocate.lastName}</td>
                  <td className="px-1 py-3">{advocate.city}</td>
                  <td className="px-1 py-3">{advocate.degree}</td>
                  <td className="px-1 py-3">
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td className="px-1 py-3">{advocate.yearsOfExperience}</td>
                  <td className="px-1 py-3">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 gap-2">
        {page !== 1 && <div onClick={()=>setPage((prev) => prev-1)}>previous</div>}
        <div className="flex">
          <div>{page}</div>
          {pages > 1 && <div>...{pages}</div>}
        </div>
        {page < pages && <div onClick={()=>setPage((prev) => prev+1)}>next</div>}
      </div>
      <div>
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
