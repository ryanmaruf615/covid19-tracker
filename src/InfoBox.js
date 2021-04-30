import React from 'react';
import {Card,CardContent,Typography} from "@material-ui/core";
import "./InfoBox.css";


function InfoBox({title,cases,total,isRed,active,...props})  {

        return (
            <Card
                onClick={props.onClick}
                className={`infoBox ${active && "infobox--selected"} 
                ${isRed && "infobox--Red"}`}>
                <CardContent>
                    <Typography className="infobox__title" color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className={`infobox__cases ${!isRed && "infobox--casename"}`}>{cases}</h2>
                    <Typography className="infobox__total">
                        Total:{total}
                    </Typography>
                </CardContent>
            </Card>
        );
    }


export default InfoBox;