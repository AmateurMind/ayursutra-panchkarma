import React from 'react';
import Icon from '../AppIcon';

const Button = ({ 
  variant = 'default', 
  size = 'default',
  iconName = null,
  iconPosition = 'left',
  iconSize = 16,
  className = '',
  disabled = false,
  children,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-breathing focus-ring disabled:pointer-events-none disabled:opacity-50 touch-target';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-border bg-background text-foreground hover:bg-muted hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'text-foreground hover:bg-muted hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const iconElement = iconName && (
    <Icon 
      name={iconName} 
      size={iconSize} 
      className={children ? (iconPosition === 'right' ? 'ml-2' : 'mr-2') : ''} 
    />
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

export default Button;