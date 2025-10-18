import { forwardRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styles from './styles';

 const Terms = forwardRef<View>(({  }, ref) => {
    return (
        <View style={styles.containerPriva}>
            <ScrollView>
                <Text style={styles.textPriva}>
                    <Text style={styles.subheading}>Bem-vindo ao Carchau.</Text> Valorizamos a sua privacidade e estamos comprometidos em proteger as suas informações pessoais. Esta política de privacidade descreve como coletamos, usamos, armazenamos e protegemos os seus dados. Ao utilizar o nosso aplicativo, você concorda com as práticas descritas nesta política.{"\n\n"}

                    Coletamos informações pessoais que você nos fornece diretamente ao se registrar, fazer uma reserva ou entrar em contato conosco. Esses dados são:{"\n\n"}

                    <Text style={styles.list}>- Nome completo;{"\n"}</Text>
                    <Text style={styles.list}>- Endereço;{"\n"}</Text>
                    <Text style={styles.list}>- Número de telefone;{"\n"}</Text>
                    <Text style={styles.list}>- E-mail;{"\n"}</Text>
                    <Text style={styles.list}>- Dados da sua Carteira Nacional de Habilitação (CNH), incluindo número, validade e categoria.{"\n\n"}</Text>

                    Além disso, podemos coletar informações automaticamente quando você usa o aplicativo, como dados de localização, tipo de dispositivo, endereço IP e comportamento de uso.{"\n\n"}

                    <Text style={styles.subheading}>Uso das Informações{"\n\n"}</Text>
                    Utilizamos as suas informações pessoais para:{"\n\n"}

                    <Text style={styles.list}>- Processar e gerenciar suas reservas;{"\n"}</Text>
                    <Text style={styles.list}>- Fornecer atendimento ao cliente;{"\n"}</Text>
                    <Text style={styles.list}>- Enviar comunicações relacionadas aos seus alugueis e ao nosso serviço;{"\n"}</Text>
                    <Text style={styles.list}>- Melhorar o nosso aplicativo e a experiência do usuário;{"\n"}</Text>
                    <Text style={styles.list}>- Cumprir com requisitos legais e regulatórios.{"\n\n"}</Text>

                    <Text style={styles.subheading}>Sobre o veículo{"\n\n"}</Text>
                    É importante ressaltar que, ao utilizar nossos serviços, você concorda que não nos responsabilizaremos por qualquer dano, perda ou incidente que possa ocorrer com o veículo durante o uso dos nossos serviços. Isso abrange acidentes, danos materiais, furtos e quaisquer consequências que possam surgir, nos responsabilizamos apenas pela devolução ou uso do caução.{"\n\n"}

                    <Text style={styles.subheading}>Compartilhamento de Informações{"\n\n"}</Text>
                    Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing sem o seu consentimento explícito. Podemos compartilhar suas informações com:{"\n\n"}

                    <Text style={styles.list}>- Prestadores de serviços que auxiliam na operação do nosso aplicativo e na prestação dos nossos serviços;{"\n"}</Text>
                    <Text style={styles.list}>- Autoridades governamentais ou terceiros conforme exigido por lei;{"\n"}</Text>
                    <Text style={styles.list}>- Parceiros de negócios com quem oferecemos promoções conjuntas, desde que você tenha consentido previamente.{"\n\n"}</Text>

                    <Text style={styles.subheading}>Segurança das Informações{"\n\n"}</Text>
                    Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui a criptografia de dados, o controle de acesso e a monitoração regular de nossos sistemas.{"\n\n"}

                    <Text style={styles.subheading}>Seus Direitos{"\n\n"}</Text>
                    Você tem o direito de acessar, corrigir, atualizar ou excluir suas informações pessoais. Também pode optar por não receber nossas comunicações de marketing a qualquer momento. Para exercer esses direitos, entre em contato conosco através dos canais fornecidos no aplicativo.{"\n\n"}

                    <Text style={styles.subheading}>Alterações na Política de Privacidade{"\n\n"}</Text>
                    Se você tiver dúvidas ou preocupações sobre esta política de privacidade ou sobre o tratamento de suas informações pessoais, entre em contato conosco pelo e-mail [carchauoficial@gmail.com] ou através do site. Tendo você declarado uma vez ter lido e compreendido os termos desta Política de Privacidade e concorda com a coleta e o uso de seus dados conforme descrito, não poderá ser alterado.{"\n\n"}

                    Agradecemos por confiar em nosso aplicativo de aluguel de carros. Sua privacidade é importante para nós, e estamos comprometidos em protegê-la.
                </Text>
            </ScrollView>
        </View>
    );
});

export default Terms;