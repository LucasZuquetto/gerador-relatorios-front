import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
   const [customersData, setCustomersData] = useState();
   const [empresa, setEmpresa] = useState('');
   const [consultora, setConsultora] = useState('');
   const [contrato, setContrato] = useState('');
   const [divulgação, setDivulgação] = useState('');
   const [publico, setPublico] = useState('');

   function handleChange(e, setValue) {
      setValue(e.target.value);
   }

   function handleSubmit(e) {
      e.preventDefault();
      const linhas = customersData.trim().split("\n");
      const objetos = [];
      linhas.forEach(function (linha) {
         const colunas = linha.split("\t");
         if (colunas[colunas.length - 1] === "ENVIADO") {
            const objeto = {
               profissionais: colunas[0],
               endereço: colunas[2],
               site: colunas[3],
               apresentamos: colunas[colunas.length - 1],
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
            empresa,
            consultora,
            contrato,
            divulgação,
            publico,
         },
      });

      axios
         .post(
            "http://localhost:3000/report",
            {
               dados: objetos,
               header: {
                  empresa,
                  consultora,
                  contrato,
                  divulgação,
                  publico,
               },
            },
            { responseType: "blob" }
         )
         .then((res) => {
            console.log(res.data);
            const file = new Blob([res.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
         });
   }

   return (
      <form onSubmit={handleSubmit}>
         <div>
            <div>
               <label>EMPRESA</label>
               <input
                  onChange={(e) => handleChange(e, setEmpresa)}
                  type="text"
                  placeholder="EMPRESA"
               />
            </div>
            <div>
               <label>CONSULTORA</label>
               <input
                  onChange={(e) => handleChange(e, setConsultora)}
                  type="text"
                  placeholder="CONSULTORA"
               />
            </div>
            <div>
               <label>CONTRATO</label>
               <input
                  onChange={(e) => handleChange(e, setContrato)}
                  type="text"
                  placeholder="CONTRATO"
               />
            </div>
            <div>
               <label>DIVULGAÇÃO</label>
               <input
                  onChange={(e) => handleChange(e, setDivulgação)}
                  type="text"
                  placeholder="DIVULGAÇÃO"
               />
            </div>
            <div>
               <label>PÚBLICO-ALVO</label>
               <input
                  onChange={(e) => handleChange(e, setPublico)}
                  type="text"
                  placeholder="PÚBLICO-ALVO"
               />
            </div>
         </div>

         <textarea
            onChange={(e) => handleChange(e, setCustomersData)}
         ></textarea>
         <button type="submit">SUBMIT</button>
      </form>
   );
}

export default App;
