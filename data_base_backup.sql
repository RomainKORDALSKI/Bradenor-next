--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 14.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: braderie
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO braderie;

--
-- Name: update_event_coordinates(); Type: FUNCTION; Schema: public; Owner: braderie
--

CREATE FUNCTION public.update_event_coordinates() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    event_record RECORD;
    city_coordinates RECORD;
BEGIN
    -- Parcours des événements sans coordonnées géographiques
    FOR event_record IN
        SELECT id, ville
        FROM event
        WHERE longitude IS NULL OR latitude IS NULL
    LOOP
        -- Récupération des coordonnées géographiques de la ville depuis une source externe
        BEGIN
            SELECT longitude, latitude
            INTO city_coordinates.lon, city_coordinates.lat
            FROM Commune
            WHERE nom_commune = event_record.ville;

            -- Vérifier si les coordonnées ont été trouvées
            IF city_coordinates.lon IS NULL OR city_coordinates.lat IS NULL THEN
                RAISE NOTICE 'Coordonnées introuvables pour la ville %', event_record.ville;
            ELSE
                -- Mise à jour des coordonnées dans la table event
                UPDATE event
                SET longitude = city_coordinates.lon,
                    latitude = city_coordinates.lat
                WHERE id = event_record.id;
            END IF;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE NOTICE 'Coordonnées introuvables pour la ville %', event_record.ville;
            WHEN TOO_MANY_ROWS THEN
                RAISE EXCEPTION 'Trop de lignes trouvées pour la ville %', event_record.ville;
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Erreur inattendue lors de la mise à jour des coordonnées pour la ville %', event_record.ville;
        END;
    END LOOP;
END;
$$;


ALTER FUNCTION public.update_event_coordinates() OWNER TO braderie;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: braderie
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO braderie;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: braderie
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO braderie;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: braderie
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO braderie;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: braderie
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: event; Type: TABLE; Schema: public; Owner: braderie
--

CREATE TABLE public.event (
    id integer NOT NULL,
    pays character varying(255),
    departement character varying(255),
    arrondissement character varying(255),
    code_postal character varying(255),
    ville character varying(255),
    salle character varying(255),
    rue character varying(255),
    type_braderie character varying(255),
    date date,
    heure_debut_visiteur time without time zone,
    heure_fin_visiteur time without time zone,
    nb_exposants integer,
    toilettes_publiques boolean,
    reserve_aux_particuliers boolean,
    exposant_heure_arrivee time without time zone,
    emplacement_prix numeric(5,2),
    commentaire text,
    organisateur_personne_morale character varying(255),
    organisateur_telephone character varying(255),
    organisateur_facebook character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    latitude double precision,
    longitude double precision,
    "userId" integer,
    location public.geometry(Point,4326)
);


ALTER TABLE public.event OWNER TO braderie;

--
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: braderie
--

CREATE SEQUENCE public.event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.event_id_seq OWNER TO braderie;

--
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: braderie
--

ALTER SEQUENCE public.event_id_seq OWNED BY public.event.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: braderie
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO braderie;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: braderie
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO braderie;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: braderie
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: event id; Type: DEFAULT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.event ALTER COLUMN id SET DEFAULT nextval('public.event_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: braderie
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240616074332-add-lat-lon-to-event.js
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: braderie
--

COPY public."Users" (id, email, nom, prenom, password, role, "createdAt", "updatedAt") FROM stdin;
1	romain.kordalski@gmail.com	Kordalski	Romain	$2a$10$52h22nvmZm0BB8DGjnNAHulunB1antp9Cwosjc6DMTD6EGrMT6DtG	user	2024-06-21 00:54:53.673+02	2024-06-21 00:54:53.673+02
2	aliciabecue@gmail.com	Becue	Alicia	$2a$10$iTlGtZtHFZPYi.BHHeJtqu2CZTrHi2JxTi5VD93Fz6xUeHa5NoCpC	user	2024-06-21 00:58:58.731+02	2024-06-21 00:58:58.731+02
3	admin@admin.com	KORDALSKI	Romain	$2a$10$Nweem.Cq4lhFd356Ps7FVuvocfuqDSt/lBIQ.Xd2PVlZPpTaK98ra	admin	2024-06-26 09:49:19.318+02	2024-06-26 09:49:19.318+02
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: braderie
--

COPY public.event (id, pays, departement, arrondissement, code_postal, ville, salle, rue, type_braderie, date, heure_debut_visiteur, heure_fin_visiteur, nb_exposants, toilettes_publiques, reserve_aux_particuliers, exposant_heure_arrivee, emplacement_prix, commentaire, organisateur_personne_morale, organisateur_telephone, organisateur_facebook, created_at, updated_at, latitude, longitude, "userId", location) FROM stdin;
2	FR France	62 Pas de Calais	Lens	62800	Lievin	\N	rue Thiers	marché aux puces	2024-08-10	08:00:00	18:00:00	400	t	f	07:00:00	7.00	\N	Comité des Fêtes de Riaumont	09 81 72 00 29	\N	2023-05-19 02:00:00+02	2024-06-16 13:35:19.53+02	50.4231	2.7702	\N	0101000020E61000009A081B9E5E29064003780B2428364940
3	FR France	59 Nord	Avesnes sur Helpe	59530	Frasnoy	\N	rue de l Eglise	brocante	2024-08-10	08:00:00	18:00:00	150	t	t	06:00:00	5.00	\N	Association des Fêtes	03 27 49 02 98	\N	2024-04-25 02:00:00+02	2024-06-16 13:35:19.589+02	50.2756	3.6695	\N	0101000020E61000004260E5D0225B0D4088635DDC46234940
4	FR France	59 Nord	Douai	59500	Douai	\N	Place de Meaux	braderie	2024-08-10	07:00:00	17:00:00	150	t	t	06:00:00	5.00	\N	Les Naëlys de Frais Marais	06 03 81 86 86	\N	2024-05-26 02:00:00+02	2024-06-16 13:35:19.659+02	50.3785	3.1004	\N	0101000020E6100000AF25E4839ECD08409CC420B072304940
5	FR France	62 Pas de Calais	Saint Omer	62380	Acquin Westbecourt	\N	\N	brocante	2024-08-10	08:00:00	20:00:00	70	t	t	06:00:00	0.50	\N	ASL Animation Securite Loisirs	07 84 84 50 13	\N	2023-12-17 01:00:00+01	2024-06-16 13:35:19.714+02	50.7333	2.0763	\N	0101000020E6100000787AA52C439C004012143FC6DC5D4940
1	FR France	62 Pas de Calais	Lens	62110	Henin Beaumont	\N	rue Charles Demuynck	marché aux puces	2024-08-10	09:00:00	18:00:00	800	t	t	07:00:00	3.50	\N	ALPH	06 83 09 81 36	testtesttest	2024-04-16 02:00:00+02	2024-06-21 15:15:27.595+02	50.4189	2.9584	\N	0101000020E610000026E4839ECDAA0740AF25E4839E354940
6	FR France	62 Pas de Calais	Bethune	62138	Douvrin	\N	rue Seraphin Cordier	marché aux puces en salle	2024-08-10	09:00:00	18:00:00	100	t	f	07:00:00	5.00	\N	le combat de Sophie	07 78 69 51 14	sur FaceBook	2024-05-24 02:00:00+02	2024-06-16 13:35:19.774+02	50.5103	2.8321	\N	0101000020E61000004703780B24A806400C93A98251414940
7	FR France	59 Nord	Dunkerque	59299	Boeschepe	\N	rue de poperinghe	brocante	2024-08-11	06:00:00	17:00:00	300	t	t	05:00:00	2.00	le descriptif de lorganisateur sur le site de la mairie	Pétanque Boeschépoise	06 31 98 18 64	sur FaceBook	2024-03-08 01:00:00+01	2024-06-16 13:35:19.827+02	50.8007	2.7004	\N	0101000020E61000007CF2B0506B9A05401FF46C567D664940
8	FR France	59 Nord	Dunkerque	59190	Hazebrouck	\N	Avenue Jean Bart	brocante	2024-08-11	06:00:00	19:00:00	400	t	t	05:00:00	0.00	\N	Comité des Fetes du pont Rommel	06 89 65 38 20	\N	2024-02-16 01:00:00+01	2024-06-16 13:35:19.889+02	50.7254	2.5357	\N	0101000020E6100000D3BCE3141D4904405B423EE8D95C4940
9	FR France	59 Nord	Dunkerque	59143	Holque	\N	rue de lancienne colme	brocante	2024-08-11	07:00:00	18:00:00	120	t	t	06:00:00	1.00	\N	Holque Culturisme	06 62 08 92 16	\N	2024-03-31 01:00:00+01	2024-06-16 13:35:19.96+02	50.8539	2.2051	\N	0101000020E6100000DC4603780BA40140F7065F984C6D4940
10	FR France	59 Nord	Valenciennes	59220	Denain	\N	avenue Jean Jaurès	vide greniers	2024-08-11	07:00:00	18:00:00	270	t	f	06:00:00	5.00	\N	comite Jaures	06 20 62 29 60	\N	2024-06-01 02:00:00+02	2024-06-16 13:35:20.028+02	50.329	3.3922	\N	0101000020E6100000FAEDEBC039230B40273108AC1C2A4940
11	FR France	62 Pas de Calais	Lens	62210	Avion	centre culturel "Fernand Leger"	place de la République	marché aux puces	2024-08-11	08:00:00	17:00:00	100	t	f	06:30:00	6.00	\N	Pourquoi pas nous	07 89 79 37 74	sur FaceBook	2024-04-01 02:00:00+02	2024-06-16 13:35:20.081+02	50.404	2.8243	\N	0101000020E61000000EBE30992A980640C1CAA145B6334940
12	FR France	62 Pas de Calais	Montreuil	62140	Hesdin	\N	Place d armes	brocante	2024-08-11	08:00:00	18:00:00	300	t	t	07:00:00	5.00	\N	la mairie d Hesdin	03 21 86 84 76	\N	2024-04-15 02:00:00+02	2024-06-16 13:35:20.146+02	50.3741	2.0383	\N	0101000020E6100000917EFB3A704E004080B74082E22F4940
13	FR France	59 Nord	Douai	59450	Sin le Noble	\N	rue Eugene Blassel	braderie	2024-08-11	08:00:00	18:00:00	200	t	f	06:00:00	6.50	\N	Comite du Quartier du Vieux Faubourg	07 83 38 78 82	sur FaceBook	2024-04-10 02:00:00+02	2024-06-16 13:35:20.423+02	50.3672	3.1213	\N	0101000020E6100000D50968226CF80840AC8BDB68002F4940
14	FR France	59 Nord	Douai	59119	Waziers	\N	rue Louis Pinte	brocante	2024-08-11	08:00:00	16:00:00	205	f	t	07:00:00	5.00	\N	Association Géants de Waziers	06.10.82.77.42	\N	2024-04-10 02:00:00+02	2024-06-16 13:35:20.467+02	50.3841	3.1121	\N	0101000020E6100000840D4FAF94E50840613255302A314940
15	FR France	62 Pas de Calais	Calais	62370	Audruicq	\N	Place du Général de Gaulle	vide greniers	2024-08-11	07:00:00	17:00:00	50	t	f	07:00:00	5.00	\N	Comité des Fêtes dAudruicq	06 37 56 98 20	\N	2024-01-20 01:00:00+01	2024-06-16 13:35:20.539+02	50.8809	2.0858	\N	0101000020E610000072F90FE9B7AF0040F085C954C1704940
16	FR France	62 Pas de Calais	Saint Omer	62560	Renty	\N	rue principale	brocante	2024-08-11	07:00:00	18:00:00	180	t	f	06:30:00	1.00	\N	Comité des Fetes	06 09 17 22 06	\N	2024-04-19 02:00:00+02	2024-06-16 13:35:20.623+02	50.5771	2.0677	\N	0101000020E61000007B832F4CA68A0040C442AD69DE494940
17	FR France	62 Pas de Calais	Saint Omer	62370	Ruminghem	\N	rue du Grand chemin de l’église	brocante	2024-08-11	06:00:00	18:00:00	\N	t	t	\N	\N	\N	Les Majorettes de Ruminghem	06 88 33 45 25	\N	2024-05-30 02:00:00+02	2024-06-16 13:35:20.697+02	50.856	2.1664	\N	0101000020E6100000696FF085C954014021B07268916D4940
18	FR France	62 Pas de Calais	\N	62700	Bruay la Buissière	\N	Rue victor hugo	Marché aux puces	2024-08-11	09:00:00	18:00:00	300	\N	t	07:00:00	5.00	\N	Comité Animationdu Quartier des Terrasses	09 87 39 05 46	\N	2024-06-14 10:59:17.715326+02	2024-06-16 13:35:20.799+02	50.4891	2.5505	\N	0101000020E61000008195438B6C6704409F3C2CD49A3E4940
19	FR France	62 Pas de Calais	\N	62138	Douvrin	Joseph Liderman	rue Seraphin Cordier	Marché aux puces en salle	2024-08-11	09:00:00	18:00:00	100	t	t	07:00:00	5.00	\N	le combat de Sophie	07 78 69 51 14	les modalités d inscription sur FaceBook	2024-06-14 10:59:17.715326+02	2024-06-16 13:35:20.855+02	50.5103	2.8321	\N	0101000020E61000004703780B24A806400C93A98251414940
20	FR France	62 Pas de Calais	\N	62280	Saint Martin Boulogne	\N	rue(s) inconnue(s)	Braderie Brocante	2024-08-11	07:00:00	18:00:00	120	\N	t	06:30:00	4.00	Inscription à partir du 1 Mai, du lundi au dimanche, de 10h00 à 13h00, fermé le mercredi, au café Hermitage (120 route de Desvres)	OSM Olympique Saint Martin	06 33 97 57 63	l actualité de l organisateur sur FaceBook	2024-06-14 10:59:17.715326+02	2024-06-16 13:35:20.911+02	50.7229	1.6468	\N	0101000020E610000045D8F0F44A59FA3FA323B9FC875C4940
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: Romain
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: braderie
--

COPY public.users (id, email, nom, prenom, password, role, created_at, updated_at) FROM stdin;
\.


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: braderie
--

SELECT pg_catalog.setval('public."Users_id_seq"', 3, true);


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: braderie
--

SELECT pg_catalog.setval('public.event_id_seq', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: braderie
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: event event_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event event_userId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: braderie
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT "event_userId_fkey1" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

