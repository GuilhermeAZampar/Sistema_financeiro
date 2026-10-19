import { useState,useEffect } from 'react'
import './App.css'
import DashBoard from "./components/Dashboard.tsx"
import Transacoes from "./components/Transacoes.tsx";
import Cadastro from "./components/CadastrarTransacoes.tsx";


type Resumo={
    Saldo:string,
    Receita:string,
    Despesa:string
}

function App() {
    const[resumo,setResumo]=useState<Resumo | null>(null)
    const[atualizacao,setAtualizacao]=useState(0)
    useEffect(()=>{
        fetch('http://127.0.0.1:5000/resumo')
            .then(response=>{
                return response.json()

            }).then(data=>{
                setResumo(data)
        })
            .catch(error=>{
                console.log("Erro:",error)
            })
    },[atualizacao])


  return (
    <>
      <h1>Sistema financeiro</h1>
        {resumo && (
            <DashBoard Saldo={resumo.Saldo} Receita={resumo.Receita} Despesa={resumo.Despesa}/>
        )}
        <Cadastro onCadastro={()=>setAtualizacao((anterior=>anterior + 1))}/>
        <Transacoes atualizacao={atualizacao} OnAtualizar={()=>setAtualizacao(anterior=>anterior+1)} />


    </>
  )
}

export default App


