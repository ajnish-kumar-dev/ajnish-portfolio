import React from 'react';
import { Helmet } from 'react-helmet-async';
import { personalInfo } from '../data/portfolio';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = `${personalInfo.name} - ${personalInfo.title}. ${personalInfo.bio}`,
  keywords = ['portfolio', 'developer', 'java', 'web development', 'BCA student'],
  image = '/og-image.jpg',
  url = window.location.href,
}) => {
  const fullTitle = title ? `${title} | ${personalInfo.name}` : `${personalInfo.name} - ${personalInfo.title}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={personalInfo.name} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={personalInfo.name} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: personalInfo.name,
          jobTitle: personalInfo.title,
          description: personalInfo.bio,
          email: personalInfo.email,
          telephone: personalInfo.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: personalInfo.location,
          },
          sameAs: [
            'https://github.com/ajnish-kumar-sahu',
            'https://linkedin.com/in/ajnish-kumar-20ag',
          ],
        })}
      </script>
    </Helmet>
  );
};