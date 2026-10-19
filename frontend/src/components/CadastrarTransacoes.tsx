import {useState,type SubmitEvent} from "react";

type CadastroProps={
    onCadastro:()=>void
}

export default function Cadastro({onCadastro}:CadastroProps){
    const[descricao,setDescricao]=useState('')
    const[categoria,setCategoria]=useState('')
    const[tipo,setTipo]=useState('')
    const[valor,setValor]=useState('')
    const [data,setData]=useState('')
    function fazer_cadastro(e:SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        fetch('http://127.0.0.1:5000/cadastrar_transacao',{
            method:"POST",
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                descricao,
                categoria,
                tipo,
                valor,
                data
            })
        },)
            .then(response=>{
                if(!response.ok){
                    throw new Error(`Erro ${response.status}`)
                }
                return response.json()
            })
            .then(data=>{
                alert(data.message)
                onCadastro()
                setCategoria('')
                setTipo('')
                setData('')
                setValor('')
                setDescricao('')

            })
            .catch(error=>{
                console.log("Erro: ",error)
                alert("Não foi possivel cadastrar a transação")
            })

    }
    function cancelar(){
        setDescricao('')
        setValor('')
        setData('')
        setTipo('')
        setCategoria('')
    }


    return(
        <>
            <form className="form-cadastro" onSubmit={fazer_cadastro}>
                <input type='text' placeholder="Digite a descrição" value={descricao} onChange={(e=>{setDescricao(e.target.value)})} required></input>
                <select value={categoria} onChange={(e=>{setCategoria(e.target.value)})} required>
                    <option value="" disabled>Selecione a categoria</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Afins">Afins</option>
                </select>
                <select value={tipo}  onChange={(e=>{setTipo(e.target.value)})} required>
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                </select>
                <input type='number' placeholder="Digite o valor " value={valor} onChange={(e=>{setValor(e.target.value)})} min="0.01" step="0.01" required></input>
                <input type='date' placeholder="Digite a data" value={data} onChange={(e=>{setData(e.target.value)})} required></input>
                <button className="btn-cadastrar" type='submit'>Enviar</button>
            </form>
            {(descricao || tipo || categoria || valor || data )&&(
                <button className="btn-cancelar" onClick={cancelar}>Cancelar</button>
            )}
        </>
    )

}