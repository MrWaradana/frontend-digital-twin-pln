import { ContentLayout } from '@/containers/ContentLayout';
import { Metadata } from 'next';
import * as React from 'react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
    title: 'Components',
    description: 'Pre-built components with awesome default',
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            <ContentLayout title='Components'>
                {children}
            </ContentLayout>
        </PrimeReactProvider>
    )
}
