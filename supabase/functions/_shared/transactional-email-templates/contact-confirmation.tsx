import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Maison LePhare'

interface ContactConfirmationProps {
  nom?: string
}

const ContactConfirmationEmail = ({ nom }: ContactConfirmationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nous avons bien reçu votre message</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {nom ? `Merci ${nom} !` : 'Merci pour votre message !'}
        </Heading>
        <Text style={text}>
          Nous avons bien reçu votre message et reviendrons vers vous dans les plus brefs délais.
        </Text>
        <Text style={text}>
          À très bientôt,
        </Text>
        <Text style={footer}>L'équipe de la {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: `Nous avons bien reçu votre message — ${SITE_NAME}`,
  displayName: 'Accusé de réception — contact',
  previewData: { nom: 'Jeanne' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#7a2e2a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '13px', color: '#7a2e2a', fontWeight: 'bold', margin: '24px 0 0' }