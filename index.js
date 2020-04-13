const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const path = require("path");
const hbs = require('handlebars');


//ENVIAR EMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mailOptions = {
  from: "bimflesan@gmail.com",
  to: "rrios@flesan.com.pe",
  cc: "rios.renzo@pucp.pe ",
  subject: "BIENVENIDO A UN NUEVO PROYECTO",
  text: "Mensaje de Prueba 02"
};

app.get("/email", (req, res) => {
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      res.send("Mensaje Enviado");
    }
  });
});

















//IMPRIMIR PDF

//COMPAILE FUNTION
const compaile = async function(data){
  const filepath = path.join(__dirname, "templates", "/test.hbs");
  const html = await fs.readFile(filepath, 'utf-8');
  return hbs.compile(html)(data);
}


//CONSTANE
const nombre = "Renzo";
const apellido = "Rios"
const issues = [
  {
    id: "01",
    nombre: "nombre 01"
  },
  {
    id: "02",
    nombre: "nombre 02"
  },
  {
    id: "03",
    nombre: "nombre 03"
  }

]

const datos = {
  "nombre": nombre,
  "apellido": apellido,
  "issues": issues
}

//METODO PARA OBTENER EL PDF
app.get("/pdf", async ( req, res) => {
  try {
    const browser = await puppeteer.launch({});
  //CREAMOS UNA NUEVA PAGINA
  const page = await browser.newPage();
  //CONTENIDO DE LA PAGINA
  const content = await compaile(datos);

  await page.setContent(content);
  await page.emulateMedia("screen");
  await page.pdf({
    path: "mypdf.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "0", bottom: "0", left: "100px" }
  });
  console.log("PDF creado");
  const pdfPath =path.join(__dirname, "mypdf.pdf")
  await browser.close();
  await res.download(pdfPath);
//  res.send("PDF creado y descargado");
  } catch (error) {
    console.log(error);
    
  }
});

app.listen(3000, () => {
  console.log("server on port 3000");
});
