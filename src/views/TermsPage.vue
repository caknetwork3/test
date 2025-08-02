<template>
  <div class="terms-page">
    <div class="container">
      <!-- Header -->
      <div class="terms-header">
        <h1>Términos y Condiciones</h1>
        <p class="last-updated">Última actualización: {{ lastUpdated }}</p>
      </div>

      <!-- Navigation -->
      <div class="terms-nav">
        <div class="nav-links">
          <a href="#acceptance" class="nav-link">Aceptación</a>
          <a href="#services" class="nav-link">Servicios</a>
          <a href="#accounts" class="nav-link">Cuentas</a>
          <a href="#chococoins" class="nav-link">ChococCoins</a>
          <a href="#conduct" class="nav-link">Conducta</a>
          <a href="#privacy" class="nav-link">Privacidad</a>
          <a href="#changes" class="nav-link">Cambios</a>
          <a href="#contact" class="nav-link">Contacto</a>
        </div>
      </div>

      <!-- Terms Content -->
      <div class="terms-content">
        <!-- Section 1: Acceptance -->
        <section id="acceptance" class="terms-section">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma CAK Streamers ("la Plataforma"), 
            usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). 
            Si no está de acuerdo con alguna parte de estos términos, no debe 
            utilizar nuestros servicios.
          </p>
          <p>
            Estos términos constituyen un acuerdo legal vinculante entre usted 
            ("Usuario") y CAK ("nosotros", "nuestro" o "la Compañía").
          </p>
        </section>

        <!-- Section 2: Services -->
        <section id="services" class="terms-section">
          <h2>2. Descripción de los Servicios</h2>
          <p>
            CAK Streamers es una plataforma digital que proporciona:
          </p>
          <ul>
            <li>Servicios de gestión y representación de streamers</li>
            <li>Una plataforma para que los usuarios descubran y sigan streamers</li>
            <li>Sistema de moneda virtual (ChococCoins) para interacciones</li>
            <li>Herramientas de comunicación y notificaciones</li>
            <li>Perfiles personalizables para streamers y usuarios</li>
          </ul>
          <p>
            Nos reservamos el derecho de modificar, suspender o discontinuar 
            cualquier aspecto de nuestros servicios en cualquier momento.
          </p>
        </section>

        <!-- Section 3: User Accounts -->
        <section id="accounts" class="terms-section">
          <h2>3. Cuentas de Usuario</h2>
          
          <h3>3.1 Registro</h3>
          <p>
            Para utilizar ciertos servicios, debe crear una cuenta proporcionando 
            información precisa y completa. Usted es responsable de mantener la 
            confidencialidad de sus credenciales de acceso.
          </p>
          
          <h3>3.2 Elegibilidad</h3>
          <p>
            Debe tener al menos 13 años de edad para crear una cuenta. Los usuarios 
            menores de 18 años deben tener el consentimiento de sus padres o tutores.
          </p>
          
          <h3>3.3 Responsabilidad de la Cuenta</h3>
          <p>
            Usted es responsable de todas las actividades que ocurran bajo su cuenta. 
            Debe notificarnos inmediatamente sobre cualquier uso no autorizado.
          </p>
        </section>

        <!-- Section 4: ChococCoins -->
        <section id="chococoins" class="terms-section">
          <h2>4. Sistema ChococCoins</h2>
          
          <h3>4.1 Naturaleza de los ChococCoins</h3>
          <p>
            Los ChococCoins son una moneda virtual sin valor monetario real. 
            No pueden ser intercambiados por dinero real ni transferidos fuera 
            de la plataforma.
          </p>
          
          <h3>4.2 Obtención de ChococCoins</h3>
          <p>Los usuarios pueden obtener ChococCoins mediante:</p>
          <ul>
            <li>Bonificación de bienvenida al registrarse</li>
            <li>Participación en actividades de la comunidad</li>
            <li>Recompensas otorgadas por administradores</li>
            <li>Eventos especiales y promociones</li>
          </ul>
          
          <h3>4.3 Uso de ChococCoins</h3>
          <p>Los ChococCoins pueden utilizarse para:</p>
          <ul>
            <li>Destacar mensajes en chats</li>
            <li>Acceder a contenido exclusivo</li>
            <li>Participar en sorteos y eventos especiales</li>
            <li>Otras funciones que puedan implementarse</li>
          </ul>
          
          <h3>4.4 Pérdida de ChococCoins</h3>
          <p>
            Los ChococCoins pueden perderse por violaciones de estos términos, 
            inactividad prolongada de la cuenta, o cierre de la plataforma. 
            No garantizamos la permanencia de los ChococCoins.
          </p>
        </section>

        <!-- Section 5: User Conduct -->
        <section id="conduct" class="terms-section">
          <h2>5. Conducta del Usuario</h2>
          
          <h3>5.1 Comportamiento Aceptable</h3>
          <p>Los usuarios deben:</p>
          <ul>
            <li>Respetar a otros usuarios y streamers</li>
            <li>Proporcionar información veraz en sus perfiles</li>
            <li>Cumplir con las leyes aplicables</li>
            <li>Usar la plataforma de manera responsable</li>
          </ul>
          
          <h3>5.2 Comportamiento Prohibido</h3>
          <p>Está estrictamente prohibido:</p>
          <ul>
            <li>Acosar, intimidar o amenazar a otros usuarios</li>
            <li>Publicar contenido ofensivo, discriminatorio o ilegal</li>
            <li>Intentar hackear o comprometer la seguridad de la plataforma</li>
            <li>Crear múltiples cuentas para evadir restricciones</li>
            <li>Usar bots o automatización no autorizada</li>
            <li>Vender o transferir cuentas o ChococCoins</li>
          </ul>
          
          <h3>5.3 Consecuencias</h3>
          <p>
            Las violaciones pueden resultar en advertencias, suspensión temporal 
            o permanente de la cuenta, y pérdida de ChococCoins.
          </p>
        </section>

        <!-- Section 6: Content and Intellectual Property -->
        <section id="content" class="terms-section">
          <h2>6. Contenido y Propiedad Intelectual</h2>
          
          <h3>6.1 Contenido del Usuario</h3>
          <p>
            Los usuarios conservan los derechos sobre el contenido que publican, 
            pero otorgan a CAK una licencia para usar, mostrar y distribuir 
            dicho contenido en la plataforma.
          </p>
          
          <h3>6.2 Contenido de CAK</h3>
          <p>
            Todo el contenido de la plataforma, incluyendo diseño, código, 
            logotipos y textos, es propiedad de CAK y está protegido por 
            derechos de autor.
          </p>
        </section>

        <!-- Section 7: Privacy -->
        <section id="privacy" class="terms-section">
          <h2>7. Privacidad y Datos</h2>
          
          <h3>7.1 Recopilación de Datos</h3>
          <p>
            Recopilamos información necesaria para proporcionar nuestros servicios, 
            incluyendo datos de perfil, actividad en la plataforma y preferencias.
          </p>
          
          <h3>7.2 Uso de Datos</h3>
          <p>Utilizamos los datos para:</p>
          <ul>
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Personalizar la experiencia del usuario</li>
            <li>Comunicarnos con los usuarios</li>
            <li>Mantener la seguridad de la plataforma</li>
          </ul>
          
          <h3>7.3 Almacenamiento Local</h3>
          <p>
            Los datos se almacenan localmente en su navegador. Usted puede 
            eliminar estos datos en cualquier momento a través de la 
            configuración de su navegador.
          </p>
        </section>

        <!-- Section 8: Disclaimers -->
        <section id="disclaimers" class="terms-section">
          <h2>8. Exenciones de Responsabilidad</h2>
          
          <h3>8.1 Disponibilidad del Servicio</h3>
          <p>
            No garantizamos que la plataforma esté disponible de manera 
            ininterrumpida o libre de errores. Podemos experimentar tiempo 
            de inactividad por mantenimiento o problemas técnicos.
          </p>
          
          <h3>8.2 Contenido de Terceros</h3>
          <p>
            No somos responsables del contenido publicado por usuarios o 
            enlaces a sitios web externos. Los usuarios acceden a dicho 
            contenido bajo su propio riesgo.
          </p>
          
          <h3>8.3 Pérdida de Datos</h3>
          <p>
            Aunque tomamos medidas para proteger los datos, no podemos 
            garantizar contra la pérdida de información debido a fallas 
            técnicas o otros factores.
          </p>
        </section>

        <!-- Section 9: Changes to Terms -->
        <section id="changes" class="terms-section">
          <h2>9. Modificaciones a los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier 
            momento. Los cambios significativos serán notificados a los usuarios 
            con al menos 30 días de anticipación.
          </p>
          <p>
            El uso continuado de la plataforma después de los cambios constituye 
            la aceptación de los nuevos términos.
          </p>
        </section>

        <!-- Section 10: Termination -->
        <section id="termination" class="terms-section">
          <h2>10. Terminación</h2>
          <p>
            Cualquiera de las partes puede terminar este acuerdo en cualquier 
            momento. CAK puede suspender o terminar cuentas por violaciones 
            de estos términos.
          </p>
          <p>
            Al terminar la cuenta, el usuario pierde acceso a todos los 
            ChococCoins y contenido asociado.
          </p>
        </section>

        <!-- Section 11: Contact -->
        <section id="contact" class="terms-section">
          <h2>11. Información de Contacto</h2>
          <p>
            Para preguntas sobre estos términos, puede contactarnos a través de:
          </p>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span class="contact-text">legal@cak-streamers.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🌐</span>
              <router-link to="/contact" class="contact-link">
                Página de Contacto
              </router-link>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer Actions -->
      <div class="terms-footer">
        <div class="footer-actions">
          <router-link to="/" class="btn btn-secondary">
            Volver al Inicio
          </router-link>
          <router-link to="/contact" class="btn btn-primary">
            Contactar Soporte
          </router-link>
        </div>
        
        <div class="footer-note">
          <p>
            Al utilizar CAK Streamers, usted acepta estos términos y condiciones. 
            Si tiene preguntas, no dude en contactarnos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const lastUpdated = ref('')

onMounted(() => {
  // Establecer fecha de última actualización
  lastUpdated.value = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Smooth scroll para enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
})
</script>

<style scoped>
.terms-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.terms-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  color: var(--text-color);
}

.terms-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.last-updated {
  opacity: 0.9;
  font-size: 1rem;
  margin-bottom: 0;
}

.terms-nav {
  background: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  position: sticky;
  top: 80px;
  z-index: 100;
}

.nav-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  background: var(--light-gray);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.terms-content {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.terms-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.terms-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.terms-section h2 {
  color: var(--text-color);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.terms-section h3 {
  color: var(--text-color);
  font-size: 1.3rem;
  margin: 1.5rem 0 1rem 0;
}

.terms-section p {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
}

.terms-section ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.terms-section li {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.contact-info {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  margin-top: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-text {
  color: var(--text-color);
  font-weight: 500;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.contact-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.terms-footer {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.footer-note {
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.footer-note p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Responsive */
@media (max-width: 768px) {
  .terms-page {
    padding: 1rem 0;
  }
  
  .terms-header {
    padding: 1.5rem;
  }
  
  .terms-header h1 {
    font-size: 2rem;
  }
  
  .terms-nav {
    position: static;
    padding: 0.75rem;
  }
  
  .nav-links {
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .terms-content {
    padding: 1.5rem;
  }
  
  .terms-section h2 {
    font-size: 1.5rem;
  }
  
  .terms-section h3 {
    font-size: 1.2rem;
  }
  
  .terms-section ul {
    padding-left: 1.5rem;
  }
  
  .contact-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .terms-header h1 {
    font-size: 1.5rem;
  }
  
  .terms-content {
    padding: 1rem;
  }
  
  .terms-section {
    margin-bottom: 2rem;
  }
  
  .terms-section h2 {
    font-size: 1.3rem;
  }
  
  .nav-links {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }
  
  .contact-info {
    padding: 1rem;
  }
  
  .terms-footer {
    padding: 1.5rem;
  }
}

/* Print styles */
@media print {
  .terms-nav,
  .terms-footer {
    display: none;
  }
  
  .terms-content {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .terms-section {
    page-break-inside: avoid;
  }
}
</style>