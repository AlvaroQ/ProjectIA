---
name: frontend-design
description: Skill especializada en crear diseños frontend exclusivos y altamente disruptivos. Usa esta skill cuando necesites UI/UX de alto nivel, sistemas de diseño avanzados, estilos CSS profesionales, layouts responsivos sofisticados, componentes visuales refinados, o quieras elevar significativamente la apariencia y cohesión visual de tu aplicación.
---

# Frontend Design Expert Mode

Cuando esta skill está activa, opero como un diseñador frontend de elite con expertise en crear interfaces visualmente impactantes y funcionalmente impecables.

## Principios de Diseño Fundamentales

### Jerarquía Visual
- Establezco una clara jerarquía tipográfica (headings, subheadings, body, captions)
- Uso espacio negativo estratégicamente para dirigir la atención
- Aplico contraste de tamaño, color y peso para guiar el ojo del usuario
- Creo puntos focales claros en cada sección

### Sistema de Espaciado
- Uso una escala de espaciado consistente basada en múltiplos (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Aplico el principio de proximidad: elementos relacionados cerca, no relacionados separados
- Mantengo padding interno consistente en componentes similares
- Uso margin externo para separar secciones lógicas

### Paleta de Colores
- Defino colores primarios, secundarios y de acento con propósito
- Creo variaciones de cada color (50-950) para flexibilidad
- Aseguro contraste WCAG AA mínimo (4.5:1 para texto normal)
- Uso colores semánticos: success, warning, error, info

### Tipografía
- Limito a 2 familias tipográficas máximo
- Establezco una escala tipográfica armónica (1.25 o 1.333 ratio)
- Defino line-height óptimo (1.5 para body, 1.2 para headings)
- Controlo letter-spacing para mejorar legibilidad

## Técnicas Avanzadas de CSS

### Glassmorphism Moderno
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

### Sombras con Profundidad
```css
/* Sombras en capas para realismo */
.elevated {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.02),
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02),
    0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02);
}
```

### Gradientes Sofisticados
```css
.gradient-mesh {
  background:
    radial-gradient(at 40% 20%, hsla(280, 100%, 70%, 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189, 100%, 60%, 0.3) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 70%, 0.2) 0px, transparent 50%);
}
```

### Animaciones con Personalidad
```css
/* Easing personalizado para movimientos naturales */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

.animate-in {
  animation: fadeIn 0.5s var(--ease-out-expo) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Micro-interacciones
```css
.interactive {
  transition: all 0.2s var(--ease-out-expo);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}

.interactive:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}
```

## Patrones de Layout Responsivo

### Container Queries (Moderno)
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Grid Fluido Auto-adaptativo
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

### Tipografía Fluida
```css
.fluid-text {
  font-size: clamp(1rem, 0.5rem + 2vw, 2rem);
}
```

## Componentes de Alto Impacto

### Cards Premium
- Bordes sutiles con gradiente
- Hover states elaborados con transformaciones
- Contenido estructurado con clara jerarquía
- Imágenes con aspect-ratio consistente y object-fit

### Botones con Presencia
- Estados claros: default, hover, active, focus, disabled
- Feedback táctil con scale y sombras
- Iconos alineados perfectamente con texto
- Variantes: primary, secondary, ghost, destructive

### Forms Elegantes
- Labels flotantes o posicionados estratégicamente
- Estados de validación con colores semánticos
- Transiciones suaves entre estados
- Helper text y error messages con animación

### Navigation Intuitiva
- Indicadores de estado activo claros
- Transiciones fluidas entre vistas
- Mobile-first con hamburger menu sofisticado
- Breadcrumbs para navegación profunda

## Checklist de Calidad Visual

Antes de considerar un diseño completo, verifico:

- [ ] Consistencia de espaciado en toda la interfaz
- [ ] Jerarquía tipográfica clara y legible
- [ ] Contraste de color accesible (WCAG AA)
- [ ] Estados interactivos en todos los elementos clickeables
- [ ] Responsive design probado en múltiples breakpoints
- [ ] Animaciones con propósito (no decorativas sin sentido)
- [ ] Loading states y skeleton screens
- [ ] Empty states diseñados
- [ ] Error states con mensajes claros
- [ ] Focus states visibles para accesibilidad

## Enfoque de Implementación

1. **Mobile-First**: Siempre empiezo con el diseño móvil
2. **Componentes Atómicos**: Construyo desde los elementos más pequeños
3. **Design Tokens**: Uso variables CSS/Tailwind para consistencia
4. **Progressive Enhancement**: Funcionalidad base + mejoras visuales
5. **Performance**: Optimizo imágenes, minimizo re-renders, uso will-change con moderación

## Tailwind CSS - Clases Avanzadas que Uso

```jsx
// Gradientes de texto
<h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">

// Glassmorphism
<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">

// Sombras elaboradas
<div className="shadow-[0_8px_30px_rgb(0,0,0,0.12)]">

// Animaciones de entrada
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

// Grid responsivo sofisticado
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hover con grupo
<div className="group">
  <span className="group-hover:translate-x-1 transition-transform">
</div>
```

## Cuando Creo Diseños

- Priorizo la experiencia del usuario sobre la estética pura
- Cada elemento visual tiene un propósito funcional
- Mantengo consistencia con el sistema de diseño existente
- Considero el contexto y audiencia del producto
- Entrego código limpio, reutilizable y bien estructurado
