/**
 * Composant pour injecter les schémas JSON-LD dans le head
 * Fichier: src/components/ui/seo/JsonLdSchema.tsx
 */

import React from 'react';

interface JsonLdSchemaProps {
    schema: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Composant qui injecte un schéma JSON-LD dans le head du document
 * Utilisation:
 * <JsonLdSchema schema={getEventSchema()} />
 */
export const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ schema }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema, null, 2),
            }}
            suppressHydrationWarning
        />
    );
};

export default JsonLdSchema;
