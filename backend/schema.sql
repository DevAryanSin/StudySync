-- Enable pgvector extension
create extension if not exists vector;

-- Drop table if exists to handle dimension change
drop table if exists documents;

-- Create documents table
create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(384) -- MiniLM embedding size
);

-- Create match_documents function for RAG
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_group_id text
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql stable as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  and documents.metadata->>'group_id' = filter_group_id
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
