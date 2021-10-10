# Contributing

Thanks for taking the time to contribute to this project!

## How to help?

There are multiple tasks you can do in order to help us, for example:

- [fill an issue](https://github.com/WebCrateApp/webcrate/issues/new/choose) to report bugs or your specific needs
- contribute to [existing issues](https://github.com/WebCrateApp/webcrate/issues)
- write a [PR](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to improve the project

## Contributing workflow

In order to make a code contribution, create a fork of WebCrate by clicking the "Fork" button on [GitHub](https://github.com/WebCrateApp/webcrate) and cloning the repo to your local machine.

Please use the `develop` branch as a base for your contribution and make your changes on a new branch.

**Ensure that you [open a discussion](https://github.com/WebCrateApp/webcrate/discussions/new?category=ideas) to discuss the changes before submitting a PR.**

Once you're finished, push your branch to your repo and create a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)!

## Development

The WebCrate app constists of a Nuxt frontend with a Express backend. It uses [Deta Base](https://docs.deta.sh/docs/base/about) as its database and thus requires that you sign up for a Deta account to use it during development.

Once you are signed up, follow the steps below to get a local version of WebCrate up and running:

1. Clone this repo

```shell
git clone https://github.com/WebCrateApp/webcrate && cd webcrate
```

2. Install the dependencies

```shell
npm install
```

3. Create .env file with your [Deta Project Key](https://docs.deta.sh/docs/faqs#what-are-all-the-different-keys-for)

```shell
echo "DETA_PROJECT_KEY=your key" > .env
```

4. Run the app locally with hot reloading enabled

```sh
npm run dev
```

## Linting

[ESlint](https://eslint.org/) is used for linting. It's recommended to add the corresponding extension to your editor. It's also possible to run the `lint` script with the following command:

```sh
npm run lint
```

Verify that there are no lint errors before opening a PR.

## Testing

Make sure your changes don't break anything. There are currently no integration/unit tests available.

That's it, happy coding!