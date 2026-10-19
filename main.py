from flask import Flask,request,jsonify
from datetime import datetime
import json
import math
import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
from sqlalchemy import func
from flask_cors import CORS

load_dotenv()

app=Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db=SQLAlchemy(app)
migrate=Migrate(app,db)
class Transacoes(db.Model):
    __tablename__='transacoes'
    id=db.Column(db.Integer,primary_key=True,index=True,autoincrement=True)
    descricao=db.Column(db.String(500),nullable=False)
    valor=db.Column(db.Numeric(12,2),nullable=False)
    tipo=db.Column(db.String(25),nullable=False)
    categoria=db.Column(db.String(25),nullable=False)
    data=db.Column(db.DateTime,nullable=False)


@app.route("/transacao",methods=["GET"])
def listar_transacoes():
    categoria= request.args.get("categoria")

    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        if page<1 or limit<1:
            return jsonify({"message":"Erro na pagina"}),400
    except(ValueError,TypeError) :
        return jsonify({"message":"Erro na paginaçao"}),400

    consulta=Transacoes.query
    if categoria:
        consulta=consulta.filter_by(categoria=categoria)

    lista=consulta.order_by(Transacoes.id).offset((page-1)*limit).limit(limit).all()
    total=consulta.count()
    if not lista:
        return jsonify({"page":page,"limit":limit,"lista":[]}),200

    resposta = {"page":page,"limit":limit,"total":total,"lista":[{"id":item.id,"descricao":item.descricao,"valor":float(item.valor),"tipo":item.tipo,"categoria":item.categoria,"data":item.data.strftime("%Y-%m-%d")}for item in lista]}
    return jsonify(resposta),200

@app.route("/detalhes/<int:id>",methods=["GET"])
def detalhes(id):
    transacao_detalhes=Transacoes.query.filter_by(id=id).first()
    if not transacao_detalhes:
        return jsonify({"message":"Erro transação nao encontrada"}),404

    resposta={"descricao":transacao_detalhes.descricao,"valor":float(transacao_detalhes.valor),"tipo":transacao_detalhes.tipo,"catergoria":transacao_detalhes.categoria,"data":transacao_detalhes.data.strftime("%Y-%m-%d")}
    return jsonify(resposta),200


@app.route("/cadastrar_transacao",methods=["POST"])
def transacoes():
    dados=request.get_json()
    if not isinstance(dados,dict):
        return jsonify({"message":"Erro no json"}),400

    try:
        nova_tarefa=Transacoes(descricao=dados["descricao"], valor=dados["valor"], tipo=dados["tipo"], categoria=dados["categoria"],data=datetime.strptime(dados["data"],"%Y-%m-%d"))
    except(KeyError,ValueError,TypeError) as erro:
        print(f"Erro encontrado{erro}")
        return jsonify({"message":str(erro)}),400

    db.session.add(nova_tarefa)
    db.session.commit()
    return jsonify({"message":"Transao guardada com sucesso"}),201


@app.route("/atualizar/<int:id>",methods=["PUT"])
def atualizar_transacao(id):
    lista=Transacoes.query.filter_by(id=id).first()
    if not lista:
        return jsonify({"message":"Erro na lista"}),400

    dados = request.get_json()
    if not isinstance(dados,dict):
        return jsonify({"message":"Erro no json"}),400

    try:
        descricao = dados["descricao"]
        valor = float(dados["valor"])
        tipo = dados["tipo"]
        categoria = dados["categoria"]
        data = datetime.strptime(dados["data"], "%Y-%m-%d")
        if not math.isfinite(valor):
            raise ValueError

        if not isinstance(descricao,str) or not isinstance(tipo,str) or not isinstance(categoria,str):
            raise ValueError
        lista.descricao = descricao
        lista.valor = valor
        lista.tipo = tipo
        lista.categoria = categoria
        lista.data = data
    except(KeyError,ValueError,TypeError):
        return jsonify({"message":"Erro na lista"}),400

    db.session.commit()

    return jsonify({"message":"Transacao atualizada com sucesso"}),200



@app.route("/deletar/<int:id>",methods=["DELETE"])
def deletar(id):
    deletar_transacao=Transacoes.query.filter_by(id=id).first()
    if not deletar_transacao:
        return jsonify({"message":"Erro na objeto nao encontrado"}),404

    db.session.delete(deletar_transacao)
    db.session.commit()
    return jsonify({"message":"Transacao deletada com sucesso"}),200


@app.route("/resumo",methods=["GET"])
def resumo():
    res=db.session.query(
        func.sum(Transacoes.valor)
                 ).filter(Transacoes.tipo=="receita").scalar() or 0

    desp=db.session.query(
        func.sum(Transacoes.valor)
    ).filter(Transacoes.tipo=="despesa").scalar() or 0

    saldo = res-desp
    return jsonify({"Saldo":saldo,"Receita":res,"Despesa":desp}),200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)