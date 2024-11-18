import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

import logo from './assets/icons/Logo-Carchau.png';
import car from './assets/img/car.png';
import perfilana from './assets/img/ana.jpeg';
import perfilandrei from './assets/img/andrei.jpeg';
import perfilcamilly from './assets/img/camilly.jpeg';
import perfilcarlos from './assets/img/carlos.jpeg';



import formadireita from './assets/img/formadireita.png';
import formaesquerda from './assets/img/formaesquerda.png';
import logoApple from './assets/icons/Logo-Apple.png';
import logoAndroid from './assets/icons/android.svg';
import telas from './assets/img/telas.png';
import Insta from './assets/icons/Insta.png';
import Peugeot from './assets/img/Peugeot.png';
import Renault from './assets/img/Renault.png';
import Toyota from './assets/img/Toyota.png';
import Volkswagen from './assets/img/Volkswagen.png';
import BMW from './assets/img/BMW.png';
import Ford from './assets/img/Ford.png';
import Git from './assets/icons/Github.png';
import { useEffect, useRef, useState } from 'react';

import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const form = useRef();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsSmallScreen(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_86gb92g',
        'template_79fg633', 
        form.current, 'SiC6YxyJOy4p5Hlqs'
      )
      .then(() => {
        console.log('SUCCESS!');
        setShowAlert(true)
        {showAlert && (
          <Alert message="Este é um alerta customizado!" onClose={() => setShowAlert(false)} />
        )}
        e.target.reset();
      })
      .catch((error) => {
        console.log('FAILED...', error.text);
      });
  };

  const [showAlert, setShowAlert] = useState(false);

  const Alert = ({ message, onClose }) => {
    return (
      <div className="alert-overlay">
        <div className="alert-box">
          <p>{message}</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };


  return (
    <div>
      <header>
        <nav class="navbar">
          <a class="logo">
            <img src={logo} alt="logo" />
          </a>
          <ul class="links">
            <span class="close-btn material-symbols-rounded">close</span>
            <li><a href="#">Home</a></li>
            <li><a href="#QuemSomos">Quem Somos</a></li>
            <li><a href="#Down">Nosso Aplicativo</a></li>
            <li><a href="#Contato">Contato</a></li>
          </ul>
        </nav>
      </header>
      
    
      <div id="Home">
        <div class="objs">
          <div class="header">
              <p class="Title">Carchau</p>
              <p class="paragrafo"> Sistema de conectividade na locação de automóveis.</p>
              <p class="paragrafo"> 
              Ofertar a criação de uma nova receita aos locatários, 
              além de abrir as portas para os aluguéis digitais de forma renovada!
              </p>
          </div>
          <div class="carhome">
            <img class="car" src={car} alt="Car Image" />
          </div>
        </div>
      </div>

      <div class='formas'>
        <img class="forma" src={formaesquerda} alt="Meia lua amarela" />
      </div>
      
      <div id="QuemSomos">
        <div class='quemsomos'>
          <p class="Title" style={{textAlign: 'center',}}>Conheça nossa equipe</p>
          <div class="Group-Box">
            <div class="box">
              <div class="imgperfil">
                <img class="fotoperfil" src={perfilana} alt="foto intefrante" />
              </div>
              <div classe="textsobrenos">
                <p class="textsobrenos">Ana Beatriz Novais Pereira, de 18 anos, 
                  está no 3º ano do Ensino Médio na ETEC Zona Leste,
                  onde cursa Desenvolvimento de Sistemas.
                </p>
              </div>
            </div>
            <div class="box">
              <div class="imgperfil">
                <img class="fotoperfil" src={perfilandrei} alt="foto intefrante" />
              </div>
              <div classe="textsobrenos">
                <p class="textsobrenos">Andrei Nunes Pereira, de 18 anos, 
                  está no 3º ano do Ensino Médio na ETEC Zona Leste, onde 
                  cursa Desenvolvimento de Sistemas.
                </p>
              </div>
            </div>
            <div class="box">
              <div class="imgperfil">
                <img class="fotoperfil" src={perfilcamilly} alt="foto intefrante" />
              </div>
              <div classe="textsobrenos">
                <p class="textsobrenos">Camilly Demarco dos Santos, de 18 anos, 
                  está no 3º ano do Ensino Médio na ETEC Zona Leste, onde 
                  cursa Desenvolvimento de Sistemas.
                </p>
              </div>
            </div>
            <div class="box">
              <div class="imgperfil">
                <img class="fotoperfil" src={perfilcarlos} alt="foto intefrante" />
              </div>
              <div classe="textsobrenos">
                <p class="textsobrenos">Carlos Eduardo Fernandes Farias, de 18 anos, 
                  está no 3º ano do Ensino Médio na ETEC Zona Leste, onde cursa 
                  Desenvolvimento de Sistemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='formas' style={{display: 'grid', justifyItems: 'right', height: 10, marginTop: -40}} >
        <img class="forma" src={formadireita} alt="Meia lua" />
      </div>

        <div id="Down">
          <div class="container-Donwload">
            <div class="img-telas">
              <img class="telas" alt="" src={telas} />
            </div>
            <div class='text-down'>
              <p class="D-Title" style={{color: 'white'}}>Aplicativo Moderno</p>
              <p class='D-paragrafo'> Na Carchau, desenvolvemos este aplicativo para 
                facilitar o aluguel de carros, seja para alugar um veículo ou disponibilizar 
                o seu. Nosso objetivo é garantir que você tenha a melhor experiência 
                possível ao utilizar nossa plataforma. Por isso, criamos o aplicativo de maneira 
                acessível e agradável, pensando sempre em sua conveniência. </p>
              <div class="d-buttons" >
                {/*<!-- Botão de download para iOS -->*/}
                <a class="button">
                  <img alt="" src={logoApple} />
                  Download
                </a>

                {/*<!-- Botão de download para Android -->*/}
                <a style={{marginLeft: 2,}} href="https://docs.google.com/uc?export=download&id=1wliLi25b_NZqFp0T26LFMuAhfGawMZ-8"  class="button">
                  <img alt="" src={logoAndroid} />
                  Download                 
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class='formas'>
          <img class="forma" src={formaesquerda} alt="Meia lua amarela" style={{marginBottom: 400}} />
        </div>


        <div id="Contato">
          <div class="FaleCon" >
            <div class="right-side">
              <form ref={form} onSubmit={sendEmail}>
                <label for="nome">Nome:</label>
                <input type="text" id="nome" name="from_name" required />

                <label for="email">Email:</label>
                <input type="email" id="email" name="message" required />

                <label for="mensagem">Mensagem:</label>
                <textarea id="mensagem" name="message" rows="5" required></textarea>

                <div>
                  <button class="loading" type="submit">Enviar</button>
                    {showAlert && (
                      <Alert message="E-mail enviado com sucesso!!" onClose={() => setShowAlert(false)} />
                    )}
                </div>

              </form>
            </div>
            <div class='text-faleconosco'>
              <h1 class='F-Title' style={{fontSize: 30}}>Fale conosco</h1>
              <p class='F-paragrafo' style={{fontSize: 25}}>Se você tiver dúvidas ou quiser registrar alguma
              reclamação, entre em contato conosco. Não se esqueça de preencher todos os campos 
              e incluir seu e-mail para que possamos retornar </p>

            </div>
          </div>
        </div>


        <footer>
          <div class="footer-content">
            <div class="footer-left">
              <a href="https://www.instagram.com/carchau_oficial?igsh=eGxpNTRqZ2Y0MXBr" target="_blank" rel="noopener noreferrer">
                <img className="Ins" src={Insta} alt="Instagram" />
              </a>
              <a href="https://github.com/CarlosEduFF/Carchau/tree/Documenta%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer">
                <img class="Ins" src={Git} alt="Instagram" />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer">
                <img class="Ins" src={Git} alt="Instagram" />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer">
                <img class="Ins" src={Git} alt="Instagram" />
              </a>
            </div>
            <p class="Slogan">Carchau: O jeito fácil de alugar um carro</p>
          </div>
        </footer >
      </div>


    );
  }

  export default App;
