import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment, Icon, Button, Message } from 'semantic-ui-react';


interface Props {
    errors: any;
}

export default function ValidationErrors({errors}: Props){
    return ( 
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: any, i: any) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}