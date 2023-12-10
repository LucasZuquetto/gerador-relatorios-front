import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
   const [inputValue, setInputValue] = useState();
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
      console.log(objetos);
      axios.post("http://localhost:3000/report", {
         dados: objetos,
         header: {
            empresa: "RENATA CORTOPASSI",
            consultora: "MARCELA",
            contrato: "28/06/2023",
            divulgação: "13 a 17 NOV",
            publico: "CORRETORES DE GOIÂNIA/GO",
         },
      }).then((response) => console.log(response))
   }

   return (
      <form onSubmit={handleSubmit}>
         <textarea onChange={handleChange}></textarea>
         <button type="submit">SUBMIT</button>
      </form>
   );
}

export default App;
