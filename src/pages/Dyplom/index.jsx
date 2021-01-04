import React from "react";
import { useParams } from "react-router-dom";

import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

import { Box, Button, Container } from "@material-ui/core";

import { ReactComponent as WospLogo } from "../../files/wosp_logo.svg";
import Copyright from "../../components/Copyright";

import styles from "./styles.module.scss";

const Dyplom = () => {
  const { name } = useParams();

  async function modifyPdf() {
    const openSansBytes = await fetch("/OpenSans-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );

    const existingPdfBytes = await fetch("/dyplom-poznan.pdf").then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);
    const openSansFont = await pdfDoc.embedFont(openSansBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    const textWidth = openSansFont.widthOfTextAtSize(name, 32);

    firstPage.drawText(name, {
      x: width / 2 - textWidth / 2,
      y: height / 2 + 48,
      size: 32,
      font: openSansFont,
    });

    const pdfBytes = await pdfDoc.save();

    const file = new Blob([pdfBytes], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    window.open(fileURL);
  }

  return (
    <Container maxWidth="xs">
      <div className={styles.dyplom}>
        <WospLogo className={styles.logo} />
        <Box mt={8}>
          <Button variant="contained" color="primary" onClick={modifyPdf}>
            Pobierz Dyplom
          </Button>
        </Box>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Dyplom;
