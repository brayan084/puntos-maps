
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function Marcadores() {
    // console.trace()
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div className="card flex justify-content-center">
            <Sidebar visible={visible} position='right' onHide={() => setVisible(false)} className="w-full md:w-10rem lg:w-25rem">
                <h2>Sidebar</h2>
                <Card title="Title">
                    <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>
            </Sidebar>
            <Button icon="pi pi-arrow-left" onClick={() => setVisible(true)} />
        </div>
    )
}
