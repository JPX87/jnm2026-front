// src/components/ui/debug/ColorPalette.tsx
import React, { FC } from 'react';

// Définition des types
interface ColorGroup {
  title: string;
  colors: {
    name: string;
    varName: string;
  }[];
}

interface ColorSwatchProps {
  name: string;
  varName: string;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ name, varName }) => {
  // On utilise directement la variable CSS pour l'affichage dynamique
  const colorValue = `var(${varName})`;

  return (
    <div className="flex flex-col w-36 shrink-0 gap-2">
      {/* La boîte de couleur */}
      <div
        className="w-full h-24 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 cursor-pointer"
        style={{ backgroundColor: colorValue }}
        title={`${name} - ${varName}`}
      />
      
      {/* Les infos textuelles */}
      <div className="text-center">
        <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {name}
        </span>
        <code className="block text-xs text-gray-500 dark:text-gray-400 font-mono break-all select-all">
          {varName}
        </code>
      </div>
    </div>
  );
};

// ============================================================================
// DONNÉES MISES À JOUR AVEC VOTRE NOUVELLE CONFIGURATION
// ============================================================================
const colorGroups: ColorGroup[] = [
  {
    title: 'Palette Primaire',
    colors: [
      { name: 'Primaire', varName: '--color-primary' },
      { name: 'Primaire Clair', varName: '--color-primary-light' },
      { name: 'Primaire Foncé', varName: '--color-primary-dark' },
    ],
  },
  {
    title: 'Palette Secondaire',
    colors: [
      { name: 'Secondaire', varName: '--color-secondary' },
      { name: 'Secondaire Clair', varName: '--color-secondary-light' },
      { name: 'Secondaire Foncé', varName: '--color-secondary-dark' },
    ],
  },
  {
    title: 'Palette Tertiaire',
    colors: [
      { name: 'Tertiaire', varName: '--color-tertiary' },
      { name: 'Tertiaire Clair', varName: '--color-tertiary-light' },
      { name: 'Tertiaire Foncé', varName: '--color-tertiary-dark' },
    ],
  },
  {
    title: 'Palette Neutre',
    colors: [
      { name: 'Blanc', varName: '--color-white' },
      { name: 'Noir', varName: '--color-black' },
      { name: 'Noir Secondaire', varName: '--color-seconde-black' }, // Ajouté
      { name: 'Gris 100', varName: '--color-gray-100' },
      { name: 'Gris 200', varName: '--color-gray-200' },
      { name: 'Gris 300', varName: '--color-gray-300' },
      { name: 'Gris 400', varName: '--color-gray-400' },
      { name: 'Gris 500', varName: '--color-gray-500' },
      { name: 'Gris 600', varName: '--color-gray-600' },
    ],
  },
  {
    title: 'Couleurs de Feedback',
    colors: [
      { name: 'Succès', varName: '--color-success' },
      { name: 'Avertissement', varName: '--color-warning' },
      { name: 'Erreur', varName: '--color-error' },
    ],
  },
];

// Composant principal
export const ColorPalette: FC = () => {
  return (
    <div className="max-w-5xl mx-auto mt-20 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-2">
        <span>🎨</span> Charte Graphique
      </h1>
      
      <div className="space-y-10">
        {colorGroups.map((group) => (
          <section 
            key={group.title} 
            className="pb-8 border-b border-gray-200 dark:border-gray-800 last:border-0"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              {group.title}
            </h2>
            
            <div className="flex flex-wrap gap-6">
              {group.colors.map((color) => (
                <ColorSwatch
                  key={color.varName}
                  name={color.name}
                  varName={color.varName}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};