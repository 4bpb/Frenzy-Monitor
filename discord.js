
const Discord = require('discord.js');







function toDiscord(custom_message,description,started_at,password,products_count,dropzone,price_range,shipping_message,img_url){
    const hook = new Discord.WebhookClient(
        '641411649294696449',
        'MEMoe7Ic0BTe0YX0bTS53krYPdIEl02XOzBxo15xcowRjan09Y7enkwmZ4dMG_R-Mr14'
    );
    hook.send({
        username: 'Shark Assist',
        avatar_url: 'https://cdn.discordapp.com/avatars/579555067406057483/ab15cb83913288b89b4b9f2e5e2e14fd.webp?size=256',
        embeds: [
            {
                author: {
                    name: 'Shark Assist Monitor'
                },
                title: custom_message,
                url: 'https://frenzy.sale/'+password,
                description:
                    description,
                color: '3844263',
                fields: [
                    {
                        name: 'started_at',
                        value: started_at,
                        inline: true
                    },
                    {
                        name: 'password',
                        value: password,
                        inline: true
                    },
                    {
                        name: 'products_count',
                        value: products_count,
                        inline: true
                    },
                    {
                        name: 'dropzone',
                        value: dropzone,
                        inline: true
                    },
                    {
                        name: 'price_range',
                        value: price_range,
                        inline: true
                    },
                    {
                        name: 'shipping_message',
                        value: shipping_message,
                        inline: true
                    }
                ],
                thumbnail: {
                    url:
                        img_url
                }
            }
        ]
    });

}


module.exports = toDiscord;



//started_at,password,products_count,dropzone,price_range,shipping_message,img_url 