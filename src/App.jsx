import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const url = "http://localhost:3000";
// const url = "https://gerador-relatorios-back.onrender.com";

function App() {
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [customersData, setCustomersData] = useState("");
   const [empresa, setEmpresa] = useState("");
   const [consultora, setConsultora] = useState("");
   const [contrato, setContrato] = useState("");
   const [divulgação, setDivulgação] = useState("");
   const [publico, setPublico] = useState("");

   useEffect(() => {
      axios
         .get(`${url}/health`)
         .then((res) => {
            console.log(res.data);
            setIsLoading(false);
         })
         .catch((err) => {
            console.error(err?.response?.statusText);
            setIsLoading(true);
         });
   }, []);

   function handleChange(e, setValue) {
      setValue(e.target.value);
   }

   function handleSubmit(e) {
      e.preventDefault();
      const objetos = [];
      try {
         setIsLoading(true);
         const linhas = customersData.trim().split("\n");
         linhas.forEach(function (linha) {
            const colunas = linha.split("\t");
            if (colunas[colunas.length - 1] === "ENVIADO") {
               const objeto = {
                  profissionais: colunas[0],
                  endereço: colunas[2],
                  site: colunas[3],
                  apresentamos: "S",
                  apresentamosNao: "",
               };
               objetos.push(objeto);
            } else {
               if (colunas[colunas.length - 1] === "INVÁLIDO") {
                  return;
               }
               setError("Texto no formato incorreto");
               throw "status de envio incorreto";
            }
         });
         linhas.forEach(function (linha) {
            const colunas = linha.split("\t");
            if (colunas[colunas.length - 1] === "INVÁLIDO") {
               const objeto = {
                  profissionais: colunas[0],
                  endereço: colunas[2],
                  site: colunas[3],
                  apresentamos: "",
                  apresentamosNao: "EM ANDAMENTO",
               };
               objetos.push(objeto);
            } else {
               if (colunas[colunas.length - 1] === "ENVIADO") {
                  return;
               }
               setError("Texto no formato incorreto");
               throw "status de envio incorreto";
            }
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         return;
      }

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
            `${url}/report`,
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
            setError("");
            const file = new Blob([res.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
         })
         .catch((err) => {
            console.error(err?.response?.statusText);
            setError(err?.response?.statusText);
         })
         .finally(() => setIsLoading(false));
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
                  maxLength={45}
               />
            </div>
            <div>
               <label>CONSULTORA</label>
               <input
                  onChange={(e) => handleChange(e, setConsultora)}
                  type="text"
                  placeholder="CONSULTORA"
                  maxLength={40}
               />
            </div>
            <div>
               <label>CONTRATO</label>
               <input
                  onChange={(e) => handleChange(e, setContrato)}
                  type="text"
                  placeholder="CONTRATO"
                  maxLength={40}
               />
            </div>
            <div>
               <label>DIVULGAÇÃO</label>
               <input
                  onChange={(e) => handleChange(e, setDivulgação)}
                  type="text"
                  placeholder="DIVULGAÇÃO"
                  maxLength={34}
               />
            </div>
            <div>
               <label>PÚBLICO-ALVO</label>
               <input
                  onChange={(e) => handleChange(e, setPublico)}
                  type="text"
                  placeholder="PÚBLICO-ALVO"
                  maxLength={100}
               />
            </div>
         </div>

         <textarea
            onChange={(e) => handleChange(e, setCustomersData)}
         ></textarea>
         <button disabled={isLoading} type="submit">
            {isLoading ? "CARREGANDO..." : "GERAR RELATÓRIO"}
         </button>
         <span hidden={error === "" ? true : false}>
            {error === "Payload Too Large"
               ? "Relatório muito grande"
               : error === "Unprocessable Entity"
               ? "Texto no formato incorreto"
               : error}
         </span>
      </form>
   );
}

export default App;
