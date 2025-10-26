import React from 'react';
import './home.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Images } from '../../constants/images';
import { useEffect, useRef, useState } from 'react';
import Alert from '../../components/Alert';
import { sendEmailService } from '../../services/emailService';
import { useNavigate } from "react-router-dom";
import RoutesP from '../../constants/routes';
import Header from '../../components/header/header';

export default function Home() {

    const form = useRef<HTMLFormElement>(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsSmallScreen(mediaQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsSmallScreen(e.matches);
        };

        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.current) return;
        const result = await sendEmailService(form.current);
        if (result.success) {
            console.log("SUCCESS!");
            setShowAlert(true);
            e.currentTarget.reset();
        } else {
            console.log("Erro ao enviar:", result.error);
        }
    };

    return (
        <div>
            <Header/>

            <div id="Home">
                <div className="objs">
                    <div className="header">
                        <p className="Title">Carchau</p>
                        <p className="paragrafo"> Sistema de conectividade na locação de automóveis.</p>
                        <p className="paragrafo">
                            Ofertar a criação de uma nova receita aos locatários,
                            além de abrir as portas para os aluguéis digitais de forma renovada!
                        </p>
                    </div>
                    <div className="carhome">
                        <img className="car" src={Images.car} alt="Car Image" />
                    </div>
                </div>
            </div>

            <div className='formas'>
                <img className="forma" src={Images.formaesquerda} alt="Meia lua amarela" />
            </div>

            <div id="QuemSomos">
                <div className='quemsomos'>
                    <p className="Title" style={{ textAlign: 'center', }}>Conheça nossa equipe</p>
                    <div className="Group-Box">
                        <div className="box">
                            <div className="imgperfil">
                                <img className="fotoperfil" src={Images.perfilana} alt="foto intefrante" />
                            </div>
                            <div className="textsobrenos">
                                <p className="textsobrenos">Ana Beatriz Novais Pereira, de 18 anos,
                                    está no 3º ano do Ensino Médio na ETEC Zona Leste,
                                    onde cursa Desenvolvimento de Sistemas.
                                </p>
                            </div>
                        </div>
                        <div className="box">
                            <div className="imgperfil">
                                <img className="fotoperfil" src={Images.perfilandrei} alt="foto intefrante" />
                            </div>
                            <div className="textsobrenos">
                                <p className="textsobrenos">Andrei Nunes Pereira, de 18 anos,
                                    está no 3º ano do Ensino Médio na ETEC Zona Leste, onde
                                    cursa Desenvolvimento de Sistemas.
                                </p>
                            </div>
                        </div>
                        <div className="box">
                            <div className="imgperfil">
                                <img className="fotoperfil" src={Images.perfilcamilly} alt="foto intefrante" />
                            </div>
                            <div className="textsobrenos">
                                <p className="textsobrenos">Camilly Demarco dos Santos, de 18 anos,
                                    está no 3º ano do Ensino Médio na ETEC Zona Leste, onde
                                    cursa Desenvolvimento de Sistemas.
                                </p>
                            </div>
                        </div>
                        <div className="box">
                            <div className="imgperfil">
                                <img className="fotoperfil" src={Images.perfilcarlos} alt="foto intefrante" />
                            </div>
                            <div className="textsobrenos">
                                <p className="textsobrenos">Carlos Eduardo Fernandes Farias, de 18 anos,
                                    está no 3º ano do Ensino Médio na ETEC Zona Leste, onde cursa
                                    Desenvolvimento de Sistemas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='formas' style={{ display: 'grid', justifyItems: 'right', height: 10, marginTop: -40 }} >
                <img className="forma" src={Images.formadireita} alt="Meia lua" />
            </div>

            <div id="Down">
                <div className="container-Donwload">
                    <div className="img-telas">
                        <img className="telas" alt="" src={Images.telas} />
                    </div>
                    <div className='text-down'>
                        <p className="D-Title" style={{ color: 'white' }}>Aplicativo Moderno</p>
                        <p className='D-paragrafo'> Na Carchau, desenvolvemos este aplicativo para
                            facilitar o aluguel de carros, seja para alugar um veículo ou disponibilizar
                            o seu. Nosso objetivo é garantir que você tenha a melhor experiência
                            possível ao utilizar nossa plataforma. Por isso, criamos o aplicativo de maneira
                            acessível e agradável, pensando sempre em sua conveniência. </p>
                        <div className="d-buttons" >
                            {/*<!-- Botão de download para iOS -->*/}
                            <a className="button">
                                <img alt="" src={Images.logoApple} />
                                Download
                            </a>

                            {/*<!-- Botão de download para Android -->*/}
                            <a style={{ marginLeft: 2, }} href="https://docs.google.com/uc?export=download&id=1wliLi25b_NZqFp0T26LFMuAhfGawMZ-8" className="button">
                                <img alt="" src={Images.logoAndroid} />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className='formas'>
                <img className="forma" src={Images.formaesquerda} alt="Meia lua amarela" style={{ marginBottom: 400 }} />
            </div>


            <div id="Contato">
                <div className="FaleCon" >
                    <div className="right-side">
                        <form ref={form} onSubmit={sendEmail}>
                            <label htmlFor="nome">Nome:</label>
                            <input type="text" id="nome" name="from_name" required />

                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="message" required />

                            <label htmlFor="mensagem">Mensagem:</label>
                            <textarea id="mensagem" name="message" rows={5} required></textarea>

                            <div>
                                <button className="loading" type="submit">Enviar</button>
                                {showAlert && (
                                    <Alert message="E-mail enviado com sucesso!!" onClose={() => setShowAlert(false)} />
                                )}
                            </div>

                        </form>
                    </div>
                    <div className='text-faleconosco'>
                        <h1 className='F-Title' style={{ fontSize: 30 }}>Fale conosco</h1>
                        <p className='F-paragrafo' style={{ fontSize: 25 }}>Se você tiver dúvidas ou quiser registrar alguma
                            reclamação, entre em contato conosco. Não se esqueça de preencher todos os campos
                            e incluir seu e-mail para que possamos retornar </p>

                    </div>
                </div>
            </div>


            <footer>
                <div className="footer-content">
                    <div className="footer-left">
                        <a href="https://www.instagram.com/carchau_oficial?igsh=eGxpNTRqZ2Y0MXBr" target="_blank" rel="noopener noreferrer">
                            <img className="Ins" src={Images.Insta} alt="Instagram" />
                        </a>
                        <a href="https://github.com/CarlosEduFF/Carchau/tree/Documenta%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer">
                            <img className="Ins" src={Images.Git} alt="Instagram" />
                        </a>
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <img className="Ins" src={Images.Git} alt="Instagram" />
                        </a>
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <img className="Ins" src={Images.Git} alt="Instagram" />
                        </a>
                    </div>
                    <p className="Slogan">Carchau: O jeito fácil de alugar um carro</p>
                </div>
            </footer >
        </div>


    );
};