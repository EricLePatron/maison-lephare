import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Maison LePhare'

interface ContactNotificationProps {
  nom?: string
  email?: string
  sujet?: string
  message?: string
}

const ContactNotificationEmail = ({ nom, email, sujet, message }: ContactNotificationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouveau message via le formulaire de contact</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nouveau message de contact</Heading>
        <Text style={text}>
          Un message a été envoyé via le formulaire de contact du site {SITE_NAME}.
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={label}>De</Text>
          <Text style={value}>{nom} &lt;{email}&gt;</Text>
          <Text style={label}>Sujet</Text>
          <Text style={value}>{sujet}</Text>
          <Text style={label}>Message</Text>
          <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Vous pouvez répondre directement à {email}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) =>
    data?.sujet ? `[Contact] ${data.sujet}` : '[Contact] Nouveau message',
  displayName: 'Notification interne — contact',
  to: 'contact@maison-lephare.com',
  previewData: {
    nom: 'Jeanne Dupont',
    email: 'jeanne@example.com',
    sujet: 'Demande de renseignements',
    message: "Bonjour,\n\nJe souhaiterais en savoir plus sur vos ateliers.\n\nMerci.",
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#7a2e2a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.5', margin: '0 0 12px' }
const label = { fontSize: '12px', textTransform: 'uppercase' as const, color: '#999', margin: '12px 0 4px', letterSpacing: '0.05em' }
const value = { fontSize: '14px', color: '#222', margin: '0 0 8px', lineHeight: '1.5' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '20px 0 0' }