type DashboardProps={
    Saldo:string,
    Receita:string,
    Despesa:string
}



export default function DashBoard({Saldo,Receita,Despesa}:DashboardProps){
    return(
        <>
            <section className="dashboard">
                <div className="card receita">
            <h1>Receita: </h1>
                    <h2>{new Intl.NumberFormat('pt-br',{
                'style':'currency',
                'currency':'BRL'
            }).format(Number(Receita))}</h2>
                    </div>
                <div className="card despesa">
            <h1>Despesa: </h1>
                    <h2>{new Intl.NumberFormat('pt-br',{
                'style':'currency',
                'currency':'BRL'
            }).format(Number(Despesa))}</h2>
                    </div>
                <div className="card saldo">
            <h1>Saldo:</h1>
                    <h2>{new Intl.NumberFormat('pt-br',{
                'style':'currency',
                'currency':'BRL'
            }).format(Number(Saldo))}</h2>
                    </div>
                </section>
        </>
    )
}