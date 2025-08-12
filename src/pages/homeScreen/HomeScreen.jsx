import React from "react";
import MainSection from "./mainSection/MainSection";
import Gallery from "./gallery/Gallery";
import Destination from "./destination/Destination";
import Culture from "./headerSection/Culture";
import UploadApp from "./uploadApp/UploadApp";
import Gallery2 from "./gallery2/Gallery2";
import Contact from "./contact/Contact";
import Services from "./services/Services";

function HomeScreen() {
  return (
    <div className="relative h-full scroll-smooth">
      <MainSection id="home" />
      <Destination id="destinations" />
      <Culture id="culture" />
      <Services id="experiences" />
      <Gallery />
      <Gallery2 />
      <UploadApp />

      <Contact />
    </div>
  );
}

export default HomeScreen;
