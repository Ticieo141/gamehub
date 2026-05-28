import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Game from './src/models/Game.js';
import User from './src/models/User.js';
import Post from './src/models/Post.js';
import Order from './src/models/Order.js';

const games = [
    {
        title: "Level 250 Character - All DLC Weapons",
        gameName: "Elden Ring",
        price: 2250000,
        images: [
            "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "Level 250 character included with all legacy weapons and armor sets. Perfect for starting Shadow of the Erdtree immediately.",
        status: 'available',
        accountDetails: { username: 'elden_shadow_lord', password: 'SafePassword123!' }
    },
    {
        title: "Night City Legend - Maxed Out V",
        gameName: "Cyberpunk 2077",
        price: 1500000,
        images: [
            "https://images.unsplash.com/photo-1605898960710-863a93649987?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "Level 60 with maxed Street Cred. All iconic weapons collected and over 2 million Eurodollars in bank.",
        status: 'available',
        accountDetails: { username: 'v_nightcity_v', password: 'CyberPass77' }
    },
    {
        title: "100% Platinum Trophy Account",
        gameName: "God of War Ragnarök",
        price: 1875000,
        images: [
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "All trophies earned, all armor sets maxed out. Premium completionist account.",
        status: 'available',
        accountDetails: { username: 'kratos_beast', password: 'AtreusPassword!' }
    },
    {
        title: "Immortal 3 - Prime & Reaver Skins",
        gameName: "Valorant",
        price: 3750000,
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "Immortal 3 Peak. Full Prime Collection, Reaver Vandal, and Elderflame Operator.",
        status: 'available',
        accountDetails: { username: 'radiant_one', password: 'VandalAce123' }
    },
    {
        title: "Global Elite - CS2 Account",
        gameName: "CS2",
        price: 1625000,
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1605898960710-863a93649987?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "Global Elite rank with high trust factor. Includes rare operation coins.",
        status: 'available',
        accountDetails: { username: 'cs_pro_legacy', password: 'BusterBlade7' }
    },
    {
        title: "Super Citizen - Level 50 Cadet",
        gameName: "Helldivers 2",
        price: 1125000,
        images: [
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000"
        ],
        description: "Democratic account with Super Citizen title. All Warbonds unlocked, Level 50 Space Cadet.",
        status: 'available',
        accountDetails: { username: 'liberty_bringer', password: 'Democracy1776' }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Seed Games
        await Game.deleteMany({});
        await Game.insertMany(games);
        console.log('✅ Games Seeded!');

        // Seed Users
        console.log('⏳ Clearing users collection...');
        await User.deleteMany({});
        console.log('✅ Users collection cleared!');
        
        // Clear other collections
        console.log('⏳ Clearing posts and orders...');
        if (Post) await Post.deleteMany({});
        if (Order) await Order.deleteMany({});
        console.log('✅ Posts and Orders cleared!');

        console.log('⏳ Hashing passwords...');
        const salt = await bcrypt.genSalt(12);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);
        const hashedUserPassword = await bcrypt.hash('user123', salt);
        console.log('✅ Passwords hashed!');

        const users = [
            {
                username: 'admin',
                email: 'admin@gamehub.com',
                password: hashedAdminPassword,
                role: 'admin',
                isVerified: true
            },
            {
                username: 'user',
                email: 'user@gamehub.com',
                password: hashedUserPassword,
                role: 'user',
                isVerified: true
            }
        ];

        console.log('⏳ Inserting users...');
        await User.insertMany(users);
        console.log('✅ Users seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();

