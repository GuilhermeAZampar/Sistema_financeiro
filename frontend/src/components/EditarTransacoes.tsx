import{useState,type SubmitEvent}  from "react";

type Edicao={
    id:number,
    descricao:string,
    categoria:string,
    tipo:string,
    valor:number,
    data:string
}

type atualizacao={
    transacao:Edicao
    OnAtualizar:()=>void
    Oncancelar:()=> void

}



export default function Editar ({transacao,OnAtualizar,Oncancelar}:atualizacao){
    const[descricao,setDescricao]=useState(transacao.descricao)
    const[categoria,setCategoria]=useState(transacao.categoria)
    const[tipo,setTipo]=useState(transacao.tipo)
    const[valor,setValor]=useState(String(transacao.valor))
    const[data,setData]=useState(transacao.data)
    function Enviao_edicao(e:SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        if(transacao.id === null){
            return
        }
        fetch(`http://127.0.0.1:5000/atualizar/${transacao.id}`,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                descricao,
                categoria,
                tipo,
                valor,
                data

            })

        })
            .then(response=>{
                if(!response.ok){
                    throw new Error(`Erro: ${response.status}`)
                }
                return response.json()
            })
            .then(data=>{
                alert(data.message)
                OnAtualizar()
            })
            .catch(error=>{
                console.log("Erro:",error)
                alert("Nao foi possivel realizar a edicao")
            })
    }
    return(
        <>
            <div>
                <form className="form-edicao" onSubmit={Enviao_edicao}>
                    <input type='text' value={descricao} placeholder="Digite a nova descricão" onChange={(e)=>setDescricao(e.target.value)} required></input>
                    <select value={categoria} onChange={(e)=>{setCategoria(e.target.value)}} required>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Entretenimento">Entretenimento</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Afins">Afins</option>
                    </select>
                    <select value={tipo} onChange={(e)=>{setTipo(e.target.value)}} required>
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                    </select>
                    <input type='number' placeholder="Digite o novo valor" step="0.01" min="0.01" value={valor} onChange={(e)=>setValor(e.target.value)} required/>
                    <input type='date' value={data} onChange={(e)=>setData(e.target.value)} required/>
                    <button type='submit'>Enviar edição</button>
                    <button type='button' onClick={Oncancelar}>Cancelar Edição</button>
                </form>
            </div>

        </>
    )
}