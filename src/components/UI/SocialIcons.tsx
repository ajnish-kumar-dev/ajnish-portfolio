import React from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';

interface SocialIconsProps {
  icon: string;
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ icon, className = "w-5 h-5" }) => {
  switch (icon.toLowerCase()) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'mail':
      return <Mail className={className} />;
    case 'phone':
      return <Phone className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
};