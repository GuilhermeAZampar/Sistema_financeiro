import {useEffect,useState} from "react";
import Editar from "./EditarTransacoes.tsx";

type Transacoes={
    id:number,
    descricao:string,
    categoria:string,
    tipo:string,
    valor:number,
    data:string
}
type atualizacao={
    atualizacao:number
    OnAtualizar:()=>void
}



export default function Transacoes({atualizacao,OnAtualizar}:atualizacao){
    const [transacoes,setTransacoes]=useState<Transacoes[]>([])
    const[idexcluir,setIdExcluir]=useState<number | null >(null)
    const [editar,setEditar]=useState<Transacoes | null>(null)
    const[modalAberto,setModalAberto]=useState(false)
    const[filtro,setFiltro]=useState('')
    const[page,setPage]=useState(1)
    const [total,setTotal]=useState(0)
    const total_paginas=Math.max(1,Math.ceil(total/10))
    useEffect(()=>{
        fetch(`http://127.0.0.1:5000/transacao?page=${page}&categoria=${encodeURIComponent(filtro)}`)
            .then(response=>{
                return response.json()
            })
            .then(data=>{
                    setTransacoes(data.lista)
                    setTotal(data.total)

            })
            .catch(error=>{
                console.log("Erro",error)
            })
    },[atualizacao,filtro,page])

    function excluir(){
        if(idexcluir===null){
            return
        }
        fetch(`http://127.0.0.1:5000/deletar/${idexcluir}`,{
            method:"DELETE"
        })
            .then(response=>{
                if(!response.ok){
                    throw new Error(`Erro: ${response.status}`)
                }

                return response.json()
            })
            .then(data=>{
                console.log(data.message)
                OnAtualizar()
                setTransacoes(anterior=>anterior.filter(item=>item.id!=idexcluir))
                setIdExcluir(null)
                setModalAberto(false)
            })
            .catch(error=>{
                console.log("Erro: ",error)
            })
    }
    return(
        <>
            <select className="filtro-categoria" value={filtro} onChange={(e)=>{setFiltro(e.target.value)
            setPage(1)}}>
                <option value="">Todas as opções</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Entretenimento">Entretenimento</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Afins">Afins</option>
            </select>
            <div className="tabela-container">
                 <table className="tabela-transacoes">
                     <thead>
                     <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Data</th>
                         <th>Ações</th>
                     </tr>
                     </thead>
                     <tbody>
                        {transacoes.map(item=>(
                            <tr key={item.id}>
                                <td>{item.descricao}</td>
                                <td>{new Intl.NumberFormat('pt-br',{
                                    'style':'currency',
                                    'currency':'BRL'
                                }).format(item.valor)}</td>
                                <td>{item.categoria}</td>
                                <td>{item.tipo}</td>
                                <td>{item.data.split('-').reverse().join('/')}</td>
                                <td>
                                   <button className="btn-excluir" type='button' onClick={()=>{setIdExcluir(item.id)
                                   setModalAberto(true)}}>Excluir Transação</button>
                                    <button className="btn-editar" type='button' onClick={()=>setEditar(item)}>Editar Transação</button>



                                </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
                </div>
            <div className="paginacao">
                <button className="btn-paginacao" disabled={page===1} onClick={()=>setPage(anterior=>anterior-1)}>Anterior</button>
                <span className="pagina-atuaal">Pagina {page} de {total_paginas}</span>
                <button className="btn-paginacao" disabled={page>=total_paginas} onClick={()=>setPage(anterior=>anterior+1)}>Próxima</button>
                </div>
                {modalAberto &&(
                    <div className="modal-overlay">
                        <div className="modal-conteudo">
                        <h2>Excluir transação?</h2>
                            <p>Certeza que deseja excluir transação</p>
                            <div className="modal-acoes">
                        <button className="btn-confirmar-exclusao" type='button' onClick={excluir}> Excluir</button>
                        <button className="btn-cancelar-modal" onClick={()=>{setModalAberto(false)
                            setIdExcluir(null)}}>Cancelar</button>
                            </div>
                    </div>
                    </div>
                )}
            {editar && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                    <h2>Editar Transação</h2>
                    <Editar key={editar.id} transacao={editar} OnAtualizar={()=>{
                        OnAtualizar()
                        setEditar(null)
                    }} Oncancelar={()=>setEditar(null)}></Editar>
                        </div>

                </div>
            )}
        </>
    )

}