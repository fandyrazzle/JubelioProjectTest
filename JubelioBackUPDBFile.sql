PGDMP         *            
    w            jubelio    12.0    12.0 	               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16393    jubelio    DATABASE     �   CREATE DATABASE jubelio WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_Indonesia.1252' LC_CTYPE = 'English_Indonesia.1252';
    DROP DATABASE jubelio;
                postgres    false            �            1259    16394    barang    TABLE     �   CREATE TABLE public.barang (
    "Nama_Product" character varying,
    "SKU" character varying,
    "Gambar" character varying,
    "Harga" character varying,
    "Product_No" character varying,
    "ID" bigint NOT NULL
);
    DROP TABLE public.barang;
       public         heap    postgres    false            �            1259    16464    barang_Kunci_seq    SEQUENCE     �   ALTER TABLE public.barang ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."barang_Kunci_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    202                       0    16394    barang 
   TABLE DATA           ^   COPY public.barang ("Nama_Product", "SKU", "Gambar", "Harga", "Product_No", "ID") FROM stdin;
    public          postgres    false    202   	                  0    0    barang_Kunci_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."barang_Kunci_seq"', 72, true);
          public          postgres    false    203            �
           2606    16473    barang barang_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_pkey PRIMARY KEY ("ID");
 <   ALTER TABLE ONLY public.barang DROP CONSTRAINT barang_pkey;
       public            postgres    false    202                  x��V�r�8}��B��B�d$���!S���d.U[E)�!
��m&�|��|I�IRxgk㊡��9}�O�K]�XGQA|ח�2t_�ه���j��t��Ĩ�Mzf����2��������yr���?ӳ�L�%�jC��f���Wi��)G��$��@Osl��4�X�0:x�W&��sd�EN�!������6�!�D����T�{<���C{�-���E�"ΜP�Q	'&�X�/��|�g7�Q�«O��gKt'���@��f }�*��� ���m4oF'�V�.�2�)�@�WP�9�p�?���D~V;k��@m�"��mb�H-�/<F-:�qA�;�y��u�Ϗw����O(�*J�y��W �����]�'�=+�%�r�Vna����ܔ=,G��n�8#��-B�o�q�� D!ށ�,�?u�F�ZѾ�6�J:��TT@����[��M��S龑nu�y�ic��e��/�Q��ٷڦ�rd���sd\>1������
\��ęЉ�x�&�=�Iʈ˥G��NCZI]kA��neV��5h@�9׋���	o�*�^�_ٛ\%E��^��;��w���4]���=F�u�{��x�n���)���\�I��ր�Lm�ol#,��n=�t��B[*O[�& �ș���\�A��웺ۻA��qp�N��hz[�xg<wr� �F�Pi��4��8�{��F�Ū���k���;�AB8���4U���Jgz�pp�DV�J\�	�!�๎�,�{L��AiӶ��M�>eU��ˮo"H���J�Adc����[S��7$<'H�{ ��^�E�sU(X\�q0�k�\�^�����uV��Z@	�٧��;uL�}�;��E���&��뇳����$q&:2���43�k-M�~�6\�槅&Ճ�[�(�.��ms�$u���Tu��/���g�����_ڮi�;C���>-T$Ym7��[i@DW��t|9���'sG�FE�iQ~��G�;ߩ|�b�5Y>�kI��T�m%�#z�;�9��ѹ>a     