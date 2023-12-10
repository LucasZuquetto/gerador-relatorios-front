import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
   "pdfjs-dist/build/pdf.worker.min.js",
   import.meta.url
).toString();

function App() {
   const [inputValue, setInputValue] = useState();
   const [pdfSource, setPdfSource] = useState();
   const [numPages, setNumPages] = useState();
   const [pageNumber, setPageNumber] = useState(1);

   function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
   }

   function handleChange(e) {
      setInputValue(e.target.value);
   }

   function handleSubmit(e) {
      e.preventDefault();
      const linhas = inputValue.trim().split("\n");
      const objetos = [];
      linhas.forEach(function (linha) {
         const colunas = linha.split("\t");
         if (colunas[11] === "ENVIADO") {
            const objeto = {
               profissionais: colunas[0],
               endereço: colunas[2],
               site: colunas[3],
               apresentamos: colunas[11],
               apresentamosNao: "",
            };
            objetos.push(objeto);
         } else {
            const objeto = {
               profissionais: colunas[0],
               endereço: colunas[2],
               site: colunas[3],
               apresentamos: "",
               apresentamosNao: "EM ANDAMENTO",
            };
            objetos.push(objeto);
         }
      });
      console.log({
         dados: objetos,
         header: {
            empresa: "RENATA CORTOPASSI",
            consultora: "MARCELA",
            contrato: "28/06/2023",
            divulgação: "13 a 17 NOV",
            publico: "CORRETORES DE GOIÂNIA/GO",
         },
      });

      axios
         .post(
            "http://localhost:3000/report",
            {
               dados: objetos,
               header: {
                  empresa: "RENATA CORTOPASSI",
                  consultora: "MARCELA",
                  contrato: "28/06/2023",
                  divulgação: "13 a 17 NOV",
                  publico: "CORRETORES DE GOIÂNIA/GO",
               },
            },
            { responseType: "blob" }
         )
         .then((res) => {
            console.log(res.data);

            const file = new Blob([res.data], { type: "application/pdf" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            window.open(fileURL);
         });
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <textarea onChange={handleChange}></textarea>
            <button type="submit">SUBMIT</button>
         </form>
         {/* {pdfSource ? (
            <div>
               <Document file={pdfSource} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} />
               </Document>
               <p>
                  Page {pageNumber} of {numPages}
               </p>
            </div>
         ) : (
            ""
         )} */}
      </>
   );
}

export default App;
