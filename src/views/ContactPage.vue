npm run dev
<template>
  <div class="contact-page">
    <div class="container">
      <!-- Header -->
      <div class="contact-header">
        <h1>Contacto</h1>
        <p>¿Tienes preguntas? ¡Nos encantaría escucharte!</p>
      </div>

      <!-- Contact Options -->
      <div class="contact-options">
        <div class="contact-grid">
          <!-- General Contact -->
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <h3>Contacto General</h3>
            <p>Para consultas generales sobre CAK</p>
            <div class="contact-details">
              <a href="mailto:info@cak-streamers.com" class="contact-link">
                info@cak-streamers.com
              </a>
            </div>
          </div>

          <!-- Support -->
          <div class="contact-card">
            <div class="contact-icon">🛠️</div>
            <h3>Soporte Técnico</h3>
            <p>Ayuda con problemas técnicos</p>
            <div class="contact-details">
              <a href="mailto:support@cak-streamers.com" class="contact-link">
                support@cak-streamers.com
              </a>
            </div>
          </div>

          <!-- Business -->
          <div class="contact-card">
            <div class="contact-icon">💼</div>
            <h3>Colaboraciones</h3>
            <p>Oportunidades de negocio y partnerships</p>
            <div class="contact-details">
              <a href="mailto:business@cak-streamers.com" class="contact-link">
                business@cak-streamers.com
              </a>
            </div>
          </div>

          <!-- Streamers -->
          <div class="contact-card">
            <div class="contact-icon">🎮</div>
            <h3>Para Streamers</h3>
            <p>¿Quieres unirte a CAK?</p>
            <div class="contact-details">
              <a href="mailto:streamers@cak-streamers.com" class="contact-link">
                streamers@cak-streamers.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>Envíanos un Mensaje</h2>
            <p>Completa el formulario y te responderemos lo antes posible</p>
          </div>

          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="contact-name" class="form-label">Nombre *</label>
                <input
                  id="contact-name"
                  v-model="contactForm.name"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Tu nombre completo"
                  :class="{ 'error': formErrors.name }"
                />
                <span v-if="formErrors.name" class="error-message">{{ formErrors.name }}</span>
              </div>
              
              <div class="form-group">
                <label for="contact-email" class="form-label">Email *</label>
                <input
                  id="contact-email"
                  v-model="contactForm.email"
                  type="email"
                  class="form-input"
                  required
                  placeholder="tu@email.com"
                  :class="{ 'error': formErrors.email }"
                />
                <span v-if="formErrors.email" class="error-message">{{ formErrors.email }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="contact-subject" class="form-label">Asunto *</label>
              <select
                id="contact-subject"
                v-model="contactForm.subject"
                class="form-input"
                required
                :class="{ 'error': formErrors.subject }"
              >
                <option value="">Selecciona un asunto</option>
                <option value="general">Consulta General</option>
                <option value="support">Soporte Técnico</option>
                <option value="business">Colaboraciones</option>
                <option value="streamer">Quiero ser Streamer</option>
                <option value="bug">Reportar Error</option>
                <option value="suggestion">Sugerencia</option>
                <option value="other">Otro</option>
              </select>
              <span v-if="formErrors.subject" class="error-message">{{ formErrors.subject }}</span>
            </div>

            <div class="form-group">
              <label for="contact-message" class="form-label">Mensaje *</label>
              <textarea
                id="contact-message"
                v-model="contactForm.message"
                class="form-textarea"
                rows="6"
                required
                placeholder="Describe tu consulta o mensaje..."
                maxlength="1000"
                :class="{ 'error': formErrors.message }"
              ></textarea>
              <span v-if="formErrors.message" class="error-message">{{ formErrors.message }}</span>
              <div class="character-count">
                {{ contactForm.message.length }}/1000 caracteres
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  id="contact-newsletter"
                  v-model="contactForm.newsletter"
                  type="checkbox"
                />
                <span class="checkmark"></span>
                Quiero recibir noticias y actualizaciones de CAK
              </label>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="btn btn-primary submit-btn"
              >
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>
              <button type="button" @click="resetForm" class="btn btn-secondary">
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Social Media -->
      <div class="social-section">
        <div class="social-header">
          <h2>Síguenos en Redes Sociales</h2>
          <p>Mantente al día con las últimas noticias y actualizaciones</p>
        </div>

        <div class="social-grid">
          <a href="https://twitter.com/CAKStreamers" target="_blank" rel="noopener noreferrer" class="social-card twitter">
            <div class="social-icon">🐦</div>
            <div class="social-info">
              <h4>Twitter</h4>
              <p>@CAKStreamers</p>
              <span class="social-description">Noticias y actualizaciones diarias</span>
            </div>
            <div class="social-arrow">→</div>
          </a>

          <a href="https://instagram.com/cakstreamers" target="_blank" rel="noopener noreferrer" class="social-card instagram">
            <div class="social-icon">📷</div>
            <div class="social-info">
              <h4>Instagram</h4>
              <p>@cakstreamers</p>
              <span class="social-description">Fotos y momentos destacados</span>
            </div>
            <div class="social-arrow">→</div>
          </a>

          <a href="https://youtube.com/@CAKStreamers" target="_blank" rel="noopener noreferrer" class="social-card youtube">
            <div class="social-icon">📹</div>
            <div class="social-info">
              <h4>YouTube</h4>
              <p>CAK Streamers</p>
              <span class="social-description">Videos y highlights</span>
            </div>
            <div class="social-arrow">→</div>
          </a>

          <a href="https://discord.gg/cakstreamers" target="_blank" rel="noopener noreferrer" class="social-card discord">
            <div class="social-icon">💬</div>
            <div class="social-info">
              <h4>Discord</h4>
              <p>CAK Community</p>
              <span class="social-description">Únete a nuestra comunidad</span>
            </div>
            <div class="social-arrow">→</div>
          </a>

          <a href="https://twitch.tv/CAKStreamers" target="_blank" rel="noopener noreferrer" class="social-card twitch">
            <div class="social-icon">📺</div>
            <div class="social-info">
              <h4>Twitch</h4>
              <p>CAKStreamers</p>
              <span class="social-description">Streams oficiales de CAK</span>
            </div>
            <div class="social-arrow">→</div>
          </a>

          <a href="https://tiktok.com/@cakstreamers" target="_blank" rel="noopener noreferrer" class="social-card tiktok">
            <div class="social-icon">🎵</div>
            <div class="social-info">
              <h4>TikTok</h4>
              <p>@cakstreamers</p>
              <span class="social-description">Contenido corto y divertido</span>
            </div>
            <div class="social-arrow">→</div>
          </a>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <div class="faq-header">
          <h2>Preguntas Frecuentes</h2>
          <p>Encuentra respuestas rápidas a las preguntas más comunes</p>
        </div>

        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
            :class="{ active: activeFaq === index }"
          >
            <div
              class="faq-question"
              @click="toggleFaq(index)"
              :aria-expanded="activeFaq === index"
              :aria-controls="`faq-answer-${index}`"
              role="button"
              tabindex="0"
              @keydown.enter="toggleFaq(index)"
              @keydown.space.prevent="toggleFaq(index)"
            >
              <h4>{{ faq.question }}</h4>
              <span class="faq-toggle" aria-hidden="true">{{ activeFaq === index ? '−' : '+' }}</span>
            </div>
            <div
              v-if="activeFaq === index"
              :id="`faq-answer-${index}`"
              class="faq-answer"
              role="region"
              :aria-labelledby="`faq-question-${index}`"
            >
              <p v-html="faq.answer"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Times -->
      <div class="response-info">
        <div class="response-card">
          <div class="response-icon">⏰</div>
          <div class="response-content">
            <h3>Tiempos de Respuesta</h3>
            <ul>
              <li><strong>Consultas Generales:</strong> 24-48 horas</li>
              <li><strong>Soporte Técnico:</strong> 12-24 horas</li>
              <li><strong>Colaboraciones:</strong> 3-5 días hábiles</li>
              <li><strong>Aplicaciones de Streamers:</strong> 1-2 semanas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const loading = ref(false)
const activeFaq = ref(null)

const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const formErrors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const faqs = [
  {
    question: '¿Cómo puedo unirme como streamer a CAK?',
    answer: 'Puedes enviar tu aplicación a través del formulario de contacto seleccionando "Quiero ser Streamer" o escribiéndonos directamente a streamers@cak-streamers.com con tu información y enlaces a tus canales.'
  },
  {
    question: '¿Qué son los ChococCoins y cómo los obtengo?',
    answer: 'Los ChococCoins son nuestra moneda virtual que puedes usar para interactuar con streamers. Los obtienes registrándote, participando en la comunidad y en eventos especiales.'
  },
  {
    question: '¿CAK cobra comisiones a los streamers?',
    answer: 'Nuestro modelo de negocio se basa en partnerships y colaboraciones. Contacta a nuestro equipo de negocios para conocer los detalles específicos de nuestros acuerdos.'
  },
  {
    question: '¿Puedo cambiar mi nombre de usuario?',
    answer: 'Sí, puedes cambiar tu nombre de usuario desde la configuración de tu perfil. Ten en cuenta que algunos cambios pueden tener restricciones de tiempo.'
  },
  {
    question: '¿Cómo reporto un problema técnico?',
    answer: 'Puedes reportar problemas técnicos a través del formulario de contacto seleccionando "Soporte Técnico" o escribiendo directamente a support@cak-streamers.com.'
  },
  {
    question: '¿CAK está disponible en otros idiomas?',
    answer: 'Actualmente CAK está disponible en español. Estamos trabajando en agregar soporte para más idiomas en futuras actualizaciones.'
  }
]

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })

  // Validate name
  if (!contactForm.name.trim()) {
    formErrors.name = 'El nombre es requerido'
  } else if (contactForm.name.trim().length < 2) {
    formErrors.name = 'El nombre debe tener al menos 2 caracteres'
  }

  // Validate email
  if (!contactForm.email.trim()) {
    formErrors.email = 'El email es requerido'
  } else if (!isValidEmail(contactForm.email)) {
    formErrors.email = 'Por favor ingresa un email válido'
  }

  // Validate subject
  if (!contactForm.subject) {
    formErrors.subject = 'Por favor selecciona un asunto'
  }

  // Validate message
  if (!contactForm.message.trim()) {
    formErrors.message = 'El mensaje es requerido'
  } else if (contactForm.message.trim().length < 10) {
    formErrors.message = 'El mensaje debe tener al menos 10 caracteres'
  }

  return !Object.values(formErrors).some(error => error)
}

const isFormValid = computed(() => {
  return contactForm.name.trim() &&
         contactForm.email.trim() &&
         contactForm.subject &&
         contactForm.message.trim() &&
         isValidEmail(contactForm.email) &&
         !Object.values(formErrors).some(error => error)
})

const submitForm = async () => {
  if (!validateForm()) {
    window.showToast?.('Por favor corrige los errores en el formulario', 'error')
    return
  }
  
  loading.value = true
  
  try {
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simular posible error del servidor (10% de probabilidad)
    if (Math.random() < 0.1) {
      throw new Error('Error del servidor')
    }
    
    window.showToast?.('Mensaje enviado correctamente. Te responderemos pronto.', 'success')
    resetForm()
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    window.showToast?.('Error al enviar el mensaje. Inténtalo de nuevo.', 'error')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  contactForm.name = ''
  contactForm.email = ''
  contactForm.subject = ''
  contactForm.message = ''
  contactForm.newsletter = false
  
  // Clear errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
.contact-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  color: var(--text-color);
}

.contact-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.contact-options {
  margin-bottom: 4rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-card h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.contact-card p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.contact-details {
  margin-top: 1rem;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
  display: inline-block;
  transition: var(--transition);
}

.contact-link:hover {
  background: var(--primary-color);
  color: var(--white);
  transform: translateY(-1px);
}

.contact-form-section {
  margin-bottom: 4rem;
}

.form-container {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.character-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: var(--text-color);
  font-weight: bold;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.submit-btn {
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.social-section {
  margin-bottom: 4rem;
}

.social-header {
  text-align: center;
  margin-bottom: 2rem;
}

.social-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.social-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-decoration: none;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.social-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.social-card.twitter:hover {
  border-color: #1da1f2;
}

.social-card.instagram:hover {
  border-color: #e4405f;
}

.social-card.youtube:hover {
  border-color: #ff0000;
}

.social-card.discord:hover {
  border-color: #7289da;
}

.social-card.twitch:hover {
  border-color: #9146ff;
}

.social-card.tiktok:hover {
  border-color: #000000;
}

.social-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.social-info {
  flex: 1;
}

.social-info h4 {
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.social-info p {
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.social-description {
  font-size: 0.8rem;
  opacity: 0.7;
}

.social-arrow {
  font-size: 1.2rem;
  opacity: 0.5;
  transition: var(--transition);
}

.social-card:hover .social-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.faq-section {
  margin-bottom: 4rem;
}

.faq-header {
  text-align: center;
  margin-bottom: 2rem;
}

.faq-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.faq-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: var(--transition);
}

.faq-item.active {
  border-color: var(--primary-color);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.faq-question:hover {
  background: var(--light-gray);
}

.faq-question h4 {
  color: var(--text-color);
  margin-bottom: 0;
  font-size: 1.1rem;
}

.faq-toggle {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  transition: var(--transition);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid var(--border-color);
  animation: fadeIn 0.3s ease-out;
}

.faq-answer p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 0;
}

.response-info {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.response-card {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  max-width: 600px;
  margin: 0 auto;
}

.response-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.response-content h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.response-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.response-content li {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.response-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 1rem 0;
  }
  
  .contact-header {
    padding: 1.5rem;
  }
  
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .social-grid {
    grid-template-columns: 1fr;
  }
  
  .social-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .response-card {
    flex-direction: column;
    text-align: center;
  }
  
  .faq-question {
    padding: 1rem;
  }
  
  .faq-answer {
    padding: 0 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .contact-header h1 {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .social-header h2,
  .faq-header h2 {
    font-size: 1.5rem;
  }
  
  .response-info {
    padding: 1.5rem;
  }
}
</style>