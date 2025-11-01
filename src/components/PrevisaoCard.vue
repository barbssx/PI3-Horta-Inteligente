<template>
	<div class="col-md-4">
		<div class="card shadow-sm text-center p-3">
			<div class="fs-2">{{ icon }}</div>
			<h5 class="mt-2">{{ title }}</h5>
			<p class="mb-0 text-muted">
				Real: <strong>{{ real }}</strong>
			</p>
			<p class="text-muted">
				Prevista: <strong>{{ prev }}</strong>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: ["title", "real", "prev", "icon"],
};
</script>
