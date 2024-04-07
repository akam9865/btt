Implementation notes:

- trpc client isn't behaving well with yield, using async/await + runInAction where type safety is important
