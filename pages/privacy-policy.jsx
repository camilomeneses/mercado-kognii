import Center from '@/components/Center';
import CenterContent from '@/components/CenterContent';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useSettingsContext } from '@/components/SettingsContext';
import Title from '@/components/Title';
import { mongooseConnect } from '@/lib/mongoose';
import { Setting } from '@/models/Setting';
import styled from 'styled-components';

const Bg = styled.div`
  background-image: url('/allproducts-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding: 40px 0;
`;

const PolicyText = styled.div`
  text-align: justify;
`;

const SubTitle = styled.h2`
  font-weight: 600;
  padding: 30px 0 5px;
  margin: 0;
  font-size: 1.2rem;
  text-align: left;
`;

const SubTitleSmall = styled.h2`
  text-align: left;
  font-weight: 600;
  padding: 5px 0 5px;
  margin: 0;
  font-size: 1.1rem;
`;

const Paragraph = styled.div`
  padding: 10px 0 5px;
  margin: 0;
`;

export default function PrivacyPolicyPage({
  telephones,
  emails,
  nameOrganization,
}) {
  return (
    <>
      <Header />
      <Bg>
        <Center>
          <CenterContent>
            <Title>Política de Privacidad</Title>
            <PolicyText>
              <Paragraph>
                Esta Política de Privacidad describe cómo recopilamos,
                utilizamos y compartimos la información personal de los usuarios
                que visitan nuestra tienda en línea. Al utilizar nuestra tienda,
                aceptas las prácticas descritas en esta política.
              </Paragraph>
              <SubTitle>1. Información recopilada </SubTitle>
              <SubTitleSmall>
                1.1 Información proporcionada por el usuario
              </SubTitleSmall>
              <Paragraph>
                Recopilamos la información personal que nos proporcionas al
                crear una cuenta, realizar una compra o comunicarte con nosotros
                a través de nuestros formularios de contacto. Esta información
                puede incluir tu nombre, dirección de correo electrónico,
                dirección de envío, número de teléfono y detalles de pago.
              </Paragraph>
              <SubTitleSmall>1.2 Información de uso</SubTitleSmall>
              <Paragraph>
                Recopilamos automáticamente cierta información cuando
                interactúas con nuestra tienda en línea. Esto puede incluir tu
                dirección IP, tipo de dispositivo, sistema operativo, navegador
                web utilizado, páginas visitadas y la fecha y hora de acceso.
              </Paragraph>
              <SubTitleSmall>1.3 Cookies:</SubTitleSmall>
              <Paragraph>
                Utilizamos cookies y tecnologías similares para recopilar
                información sobre tu actividad en nuestra tienda en línea. Las
                cookies son archivos de texto que se almacenan en tu dispositivo
                para mejorar tu experiencia de usuario y proporcionar
                funcionalidades personalizadas. Puedes ajustar la configuración
                de tu navegador para rechazar las cookies, pero esto puede
                afectar la funcionalidad de nuestro sitio web.
              </Paragraph>
              <SubTitle>2. Uso de la información</SubTitle>
              <Paragraph>
                Utilizamos la información recopilada para los siguientes fines:
              </Paragraph>
              <SubTitleSmall>2.1 Procesamiento de pedidos</SubTitleSmall>
              <Paragraph>
                Utilizamos tu información personal para procesar y enviar tus
                pedidos, ponernos en contacto contigo en caso de problemas con
                el envío y proporcionarte actualizaciones sobre el estado de tu
                compra.
              </Paragraph>
              <SubTitleSmall>2.2 Atención al cliente</SubTitleSmall>
              <Paragraph>
                Utilizamos tu información para responder a tus consultas,
                preguntas y solicitudes de soporte.
              </Paragraph>
              <SubTitleSmall>2.3 Marketing</SubTitleSmall>
              <Paragraph>
                Con tu consentimiento, podemos utilizar tu información para
                enviarte comunicaciones de marketing sobre nuestros productos,
                promociones y ofertas especiales. Puedes optar por no recibir
                este tipo de comunicaciones en cualquier momento.
              </Paragraph>
              <SubTitleSmall>2.4 Mejora de nuestro servicio</SubTitleSmall>
              <Paragraph>
                Utilizamos la información recopilada para analizar el
                comportamiento de los usuarios, realizar estudios de mercado y
                mejorar la calidad de nuestros productos y servicios.
              </Paragraph>
              <SubTitle>3. Compartir información </SubTitle>
              <SubTitleSmall>3.1 Proveedores de servicios</SubTitleSmall>
              <Paragraph>
                Podemos compartir tu información con terceros que nos prestan
                servicios, como procesamiento de pagos, envío de productos y
                análisis de datos. Estos proveedores de servicios solo tienen
                acceso a la información necesaria para realizar sus funciones y
                están obligados a mantener la confidencialidad de tus datos.
              </Paragraph>
              <SubTitleSmall>3.2 Cumplimiento legal</SubTitleSmall>
              <Paragraph>
                Podemos divulgar tu información si así lo exige la ley, una
                orden judicial u otra autoridad gubernamental.
              </Paragraph>
              <SubTitle>4. Seguridad de la información</SubTitle>
              <Paragraph>
                Implementamos medidas de seguridad para proteger tu información
                personal contra accesos no autorizados, uso indebido o
                divulgación. Sin embargo, debes tener en cuenta que ningún
                método de transmisión por Internet o almacenamiento electrónico
                es completamente seguro, por lo que no podemos garantizar la
                seguridad absoluta de tus datos.
              </Paragraph>
              <SubTitle>5. Enlaces a sitios web de terceros</SubTitle>
              <Paragraph>
                Nuestra tienda en línea puede contener enlaces a sitios web de
                terceros. No nos hacemos responsables de las prácticas de
                privacidad o contenido de estos sitios. Te recomendamos revisar
                las políticas de privacidad de estos terceros antes de
                proporcionarles tu información personal.
              </Paragraph>
              <SubTitle>6. Eliminación de datos de usuarios </SubTitle>
              <SubTitleSmall>6.1 Derecho a eliminar datos</SubTitleSmall>
              <Paragraph>
                Reconocemos tu derecho a eliminar tus datos personales de
                nuestra aplicación en cualquier momento. Si deseas ejercer este
                derecho, sigue las siguientes instrucciones:
              </Paragraph>
              <SubTitleSmall>6.2 Eliminación de cuenta </SubTitleSmall>
              <Paragraph>
                Para eliminar tus datos de nuestra aplicación, inicia sesión en
                tu cuenta y navega hasta la sección &quot;Cuenta&quot; apartado
                &quot;Detalles de Cuenta&quot;. Dentro de esta sección,
                encontrarás la opción &quot;Eliminar cuenta&quot;. Al
                seleccionar esta opción, se te solicitará confirmar tu decisión
                y, una vez confirmada, tus datos personales serán eliminados de
                manera permanente de nuestra base de datos.
              </Paragraph>
              <SubTitleSmall>6.3 Retención de datos </SubTitleSmall>
              <Paragraph>
                Ten en cuenta que, aunque eliminemos tus datos personales de
                nuestra base de datos, es posible que conservemos cierta
                información de manera anonimizada o agregada para fines
                estadísticos o de análisis. Esta información no estará asociada
                directamente a tu identidad y no podrá ser utilizada para
                identificarte.
              </Paragraph>
              <SubTitleSmall>6.4 Comunicación adicional</SubTitleSmall>
              <Paragraph>
                Si tienes alguna pregunta o necesitas asistencia adicional para
                eliminar tus datos de nuestra aplicación, no dudes en ponerse en
                contacto con nuestro equipo de soporte a través de los canales
                proporcionados en la sección &quot;Contacto&quot; del pie de
                pagina de nuestra aplicación
                {telephones?.value?.length > 0
                  ? ', también llamando a los siguientes números telefónicos:'
                  : '.'}
                {telephones?.value?.map((telephone) => (
                  <>
                    <div></div>
                    <li key={telephone}>{telephone}</li>
                  </>
                ))}
                {emails?.value?.length > 0
                  ? 'Puedes escribirnos a los siguientes correos:'
                  : '.'}
                {emails?.value?.map((email) => (
                  <>
                    <div></div>
                    <li key={email}>{email}</li>
                  </>
                ))}
                Estaremos encantados de ayudarte y brindarte la orientación
                necesaria.
              </Paragraph>
              <SubTitle>7. Cambios en esta política de privacidad</SubTitle>
              <Paragraph>
                Nos reservamos el derecho de modificar esta Política de
                Privacidad en cualquier momento. Cualquier cambio será publicado
                en esta página, y se te notificará a través de los medios que
                consideremos apropiados. Te recomendamos revisar periódicamente
                esta política para estar al tanto de cualquier actualización. Si
                tienes alguna pregunta o inquietud sobre nuestra Política de
                Privacidad, no dudes en contactarnos a través de los canales
                proporcionados en nuestra tienda en línea.
              </Paragraph>
              <Paragraph>Atentamente</Paragraph>
              {nameOrganization && (
                <SubTitleSmall key={nameOrganization?.value}>{nameOrganization?.value}</SubTitleSmall>
              )}

              <Paragraph>Fecha de entrada en vigor: julio del 2023</Paragraph>
            </PolicyText>
          </CenterContent>
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    await mongooseConnect();

    //TODO Obtener los telefonos comerciales
    let telephones = [];
    telephones = await Setting.findOne({
      name: 'commercialTelephones',
    });

    //TODO Obtener las direcciones comerciales
    let emails = [];
    emails = await Setting.findOne({
      name: 'commercialEmails',
    });

    //TODO Obtener las direcciones comerciales
    let nameOrganization = [];
    nameOrganization = await Setting.findOne({
      name: 'nameOrganization',
    });

    return {
      props: {
        telephones: JSON.parse(JSON.stringify(telephones)),
        emails: JSON.parse(JSON.stringify(emails)),
        nameOrganization: JSON.parse(JSON.stringify(nameOrganization)),
      },
    };
  } catch (error) {
    console.error('Error:', error);
  }
}

