import React from 'react';
import { Button, Container, Dimmer, Loader, Menu } from 'semantic-ui-react';

interface Props {

    inverted?: boolean;
    content?: string;

}

export default function LoadingComponents({inverted = true, content = 'Loading...'}: Props) {
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
}