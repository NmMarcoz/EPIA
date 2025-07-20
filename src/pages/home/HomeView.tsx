"use client"

import type React from "react"
import { WebcamCapture } from "../webcam/WebcamModal"
import type { HomeViewProps } from "./HomeModel"
import "./Home.css"
import "../../globals.css"

interface HomeViewExtendedProps extends HomeViewProps {
  sectorCode: string
  sectorName: string
  workerName: string
  workerFunction: string
  sectorRules: string[]
}

const HomepageView: React.FC<HomeViewExtendedProps> = ({
  forgetfulnessRate,
  sectorCode,
  sectorName,
  workerName,
  workerFunction,
  sectorRules,
}) => {

  return (
    <div className="container">
      <div className="homepage-container">
        <div className="header">
          <h2>{sectorCode}</h2>
          <p>{sectorName}</p>
        </div>
        <div className="section-container">
          <section className="right-section">
            <div className="box">
              <h2>Área do funcionário</h2>
              <p>Confira se suas informações cadastrais batem.</p>
            </div>
            <div className="basic-container">
              <div className="box">
                <div className="box">
                  <div>
                    <div className="employee-info">
                      <a>Nome</a>
                      <h2>{workerName}</h2>
                    </div>
                    <div className="employee-info">
                      <a>Cargo</a>
                      <h2>{workerFunction}</h2>
                    </div>
                    <div className="employee-info">
                      <a>Taxa de Esquecimento de EPI</a>
                      <h2>{forgetfulnessRate}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="basic-container">
              <WebcamCapture />
            </div>
          </section>
          <section className="left-section">
            <div className="box">
              <h2>Lista de Requerimentos</h2>
              <p>Os seguintes itens são necessários para adentrar</p>
            </div>
            <div className="title-container">
              <div className="basic-container">
                <div className="box">
                  {sectorRules.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomepageView
