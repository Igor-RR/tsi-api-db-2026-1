import { Request,Response, Router } from "express";
import { db } from "../db";
import { Genero } from "../models/genero";

const router = Router();

router.get("/",(req: Request, res: Response)=> {
    db.all("SELECT * FROM generos",(erro,linhas)=>{
        if(erro){
            return res.status(500).json({erro: "Erro ao buscar gêneros"}
            );
        }
    
        res.json(linhas);
    });
});

router.get("/:id",(req: Request, res: Response)=>{
    const id = Number(req.params.id)

    db.get(
        "SELECT * FROM generos WHERE id = ?",
        [id], (erro) 
    )


})

router.post("/",(req: Request, res: Response)=>{
    
    /* Vou extrair nome do objeto json */
    const {nome} = req.body;

    if (!nome || nome.trim() === ""){
        return res.status(400).json({
            erro: "O campo nome do gênero é obrigatório"
        });
    } 


    db.run(
        "INSERT INTO generos (nome) VALUES (?)",
        [nome],
        function (erro) {
            if (erro){
                return res.status(500).json({
                    erro: "Erro cadastrar gênero."
                });
            }
    

        res.status(201).json({
            id: this.lastID,
            nome,
        })
    })
});

router.put("/id",(req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {nome} = req.body;

    db.run(
        "UPDATE generos SET nome = ? WHERE id = ?",
        [nome,id],function(erro){
            if(erro){
                return res.status(500).json({erro:"Erro ao atualizar genero"})
            };

            if (this.changes === 0) {
                return res.status(404).json(
                    {erro: "Gênero não encontrado"}
                );
            }
            res.send("Tudo certo! \n\n");
            res.json({
                id,
                nome
            });
        }
    )
});

router.delete("/:id",(req: Request, res: Response) => {
    const id = Number(req.params.id);

    db.run(
        "DELETE FROM generos WHERE id = ?",
        [id],function(erro){
            if(erro){
                return res.status(500).json({erro:"Erro ao deletar genero"})
            };

            if (this.changes === 0) {
                return res.status(404).json(
                    {erro: "Gênero não encontrado"}
                );
            }
            res.status(204).send();
        }
    );
} )

export default router;